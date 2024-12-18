/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const Context = createContext();

export const useContextElement = () => useContext(Context);

export default function ContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkboxes, setCheckboxes] = useState({
    free_shipping: false,
    flat_rate: false,
    local_pickup: false,
  });
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

  const handleSelectAll = (checked) => {
    const ids = checked ? cartProducts.map((item) => item.CartItemID) : [];
    setSelectedItems(ids);
  };

  const handleSelectItem = (cartItemId) => {
    setSelectedItems((prev) =>
      prev.includes(cartItemId)
        ? prev.filter((id) => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  const formatPrice = (price) => {
    return typeof price === "number" ? price.toFixed(2) : "0.00";
  };

  const fetchCartItems = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/cart-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message === "Success") {
        const cartData = response.data.data;
        setCartProducts(cartData);
        const total = cartData.reduce(
          (sum, item) => sum + item.Price * item.Quantity,
          0
        );
        setTotalPrice(Number(total.toFixed(2)));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Theo dõi thay đổi token để load giỏ hàng
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCartItems();
    } else {
      setCartProducts([]);
      setTotalPrice(0);
    }
  }, [fetchCartItems]);

  const addProductToCart = async (productID, colorID, sizeID, quantity) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/cart-items",
        {
          productID,
          colorID,
          sizeID,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) await fetchCartItems();
      Swal.fire({
        title: "Thành công",
        text: "Thêm vào giỏ hàng thành công",
        icon: "success",
      });

      return { success: true };
    } catch (error) {
      // Ném lỗi để component có thể xử lý
      if (error.response?.status === 400) {
        Swal.fire({
          title: "Lỗi",
          text: error.response.data.message || "Không thể thêm sản phẩm",
          icon: "error",
        });
        throw new Error(
          error.response.data.message || "Không thể thêm sản phẩm"
        );
      } else if (error.response?.status === 401) {
        Swal.fire({
          title: "Lỗi",
          text: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
          icon: "error",
        });
        throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      } else {
        Swal.fire({
          title: "Lỗi",
          text: "Có lỗi xảy ra, vui lòng thử lại sau",
          icon: "error",
        });
        throw new Error("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkVariantQuantity = async (variantID) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/product-variants/getVariantByID",
        { variantID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data.availableQuantity; // Trả về số lượng có sẵn
    } catch (error) {
      console.error("Error fetching variant quantity:", error);
      return 0; // Trả về 0 nếu có lỗi
    }
  };

  const setQuantity = async (cartItemId, newQuantity) => {
    if (!cartItemId || newQuantity < 1) return;

    try {
      const cartItem = cartProducts.find(
        (item) => item.CartItemID === cartItemId
      );
      if (!cartItem) return;

      const variantID = cartItem.SizeID; // Giả sử SizeID là ID của biến thể
      const availableQuantity = await checkVariantQuantity(variantID); // Gọi hàm kiểm tra số lượng

      // Kiểm tra xem số lượng yêu cầu có vượt quá số lượng có sẵn không
      if (newQuantity > availableQuantity) {
        Swal.fire({
          title: "Lỗi",
          text: "Số lượng vượt quá số lượng có sẵn",
          icon: "error",
        });
        return;
      }

      // Nếu số lượng hợp lệ, cập nhật số lượng trong giỏ hàng
      const updatedCartProducts = cartProducts.map((item) =>
        item.CartItemID === cartItemId
          ? { ...item, Quantity: newQuantity }
          : item
      );

      setCartProducts(updatedCartProducts); // Cập nhật trạng thái với danh sách sản phẩm mới

      // Gọi API để cập nhật số lượng trên máy chủ
      await updateCartItem(cartItemId, {
        productID: cartItem.ProductID,
        sizeID: cartItem.SizeID,
        colorID: cartItem.ColorID,
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("Error setting quantity:", error);
    }
  };

  const updateCartItem = async (cartItemId, data) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/cart-items/${cartItemId}`,
        {
          productID: data.productID,
          sizeID: data.sizeID,
          colorID: data.colorID,
          quantity: data.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log('Update response:', response.data);
    } catch (error) {
      console.error("Error updating cart:", error.response?.data);
      throw error;
    }
  };

  const removeSelectedItems = async () => {
    if (selectedItems.length === 0) return;
    const token = localStorage.getItem("token");
    const ids = selectedItems.join(",");

    try {
      await axios.delete(`http://127.0.0.1:8000/api/cart-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { ids },
      });

      setCartProducts((prevProducts) =>
        prevProducts.filter((item) => !selectedItems.includes(item.CartItemID))
      );

      setSelectedItems([]);
      Swal.fire({
        title: "Thành công",
        text: "Đã xóa các sản phẩm đã chọn khỏi giỏ hàng",
        icon: "success",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể xóa sản phẩm",
        icon: "error",
      });
    }
  };

  const removeCartItem = async (itemID) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://127.0.0.1:8000/api/cart-items/${itemID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Cập nhật trạng thái giỏ hàng sau khi xóa
      setCartProducts((prevProducts) =>
        prevProducts.filter((item) => item.CartItemID !== itemID)
      );
      Swal.fire({
        title: "Thành công",
        text: "Đã xóa sản phẩm khỏi giỏ hàng",
        icon: "success",
      });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể xóa sản phẩm",
        icon: "error",
      });
    }
  };

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [id]: checked,
    }));
  };

  const addToWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Thông báo",
        text: "Vui lòng đăng nhập để sử dụng tính năng này",
        icon: "warning",
      });
      return;
    }

    try {
      setIsLoadingWishlist(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/wishlist",
        { ProductID: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Response from addToWishlist:", response);
      if (response.status === 201) {
        await fetchWishlistItems();
        Swal.fire({
          title: "Thành công",
          text: "Đã thêm vào danh sách yêu thích",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể thêm vào danh sách yêu thích",
        icon: "error",
      });
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const fetchWishlistItems = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setIsLoadingWishlist(true);
      const response = await axios.get("http://127.0.0.1:8000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.message === "Success") {
        setWishlistProducts(response.data.data);
      } else {
        // Xử lý trường hợp không thành công
        console.error("Failed to fetch wishlist items:", response.data.message);
        setWishlistProducts([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistProducts([]); // Đặt lại danh sách nếu có lỗi
    } finally {
      setIsLoadingWishlist(false);
    }
  }, []);

  // Gọi fetchWishlistItems khi component mount
  useEffect(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  const removeFromWishlist = async (wishlistId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setIsLoadingWishlist(true);
      setWishlistProducts((prev) =>
        prev.filter((item) => item.WishlistID !== wishlistId)
      );

      await axios.delete(`http://127.0.0.1:8000/api/wishlist/${wishlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: "Thành công",
        text: "Đã xóa sản phẩm khỏi danh sách yêu thích",
        icon: "success",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      await fetchWishlistItems();

      if (error.response?.status === 404) {
        Swal.fire({
          title: "Lỗi",
          text: "Không tìm thấy sản phẩm trong danh sách yêu thích",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Lỗi",
          text: "Không thể xóa sản phẩm yêu thích",
          icon: "error",
        });
      }
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const isProductInWishlist = useCallback(
    (productId) => {
      return wishlistProducts.some(
        (item) => parseInt(item.ProductID) === parseInt(productId)
      );
    },
    [wishlistProducts]
  );

  const isInWishlist = useCallback(
    (productId) => {
      return wishlistProducts.some(
        (item) => parseInt(item.ProductID) === parseInt(productId)
      );
    },
    [wishlistProducts]
  );

  const updateCartItemStatus = async (cartItemId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart-items/status/",
        { ids: cartItemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Tải lại giỏ hàng sau khi cập nhật trạng thái
      await fetchCartItems();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const value = {
    cartProducts,
    totalPrice,
    loading,
    checkboxes,
    formatPrice,
    addProductToCart,
    updateCartItem,
    removeSelectedItems,
    fetchCartItems,
    setQuantity,
    handleCheckboxChange,
    removeCartItem,
    handleSelectItem,
    handleSelectAll,
    selectedItems,
    wishlistProducts,
    addToWishlist,
    fetchWishlistItems,
    removeFromWishlist,
    isProductInWishlist,
    isInWishlist,
    isLoadingWishlist,
    checkVariantQuantity,
    setCartProducts,
    updateCartItemStatus,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
