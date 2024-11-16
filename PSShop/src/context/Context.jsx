/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from 'prop-types';

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

  const calculateTotalPrice = (products) => {
    return products.reduce((total, product) => {
      const price = parseFloat(product.Price) || 0;
      const quantity = parseInt(product.Quantity) || 0;
      return total + price * quantity;
    }, 0);
  };

  const formatPrice = (price) => {
    return typeof price === "number" ? price.toFixed(2) : "0.00";
  };

  const cache = {
    products: new Map(),
    variants: new Map(),
  };

  const fetchWithCache = async (url, cacheMap) => {
    if (cacheMap.has(url)) {
      return cacheMap.get(url);
    }
    const token = localStorage.getItem("token");
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    cacheMap.set(url, response.data.data);
    return response.data.data;
  };

  // const getProductDetails = (productId) => {
  //   return fetchWithCache(`http://127.0.0.1:8000/api/products/${productId}`, cache.products);
  // };

  // const getVariantDetails = (variantId) => {
  //   return fetchWithCache(`http://127.0.0.1:8000/api/product-variants/${variantId}`, cache.variants);
  // };

  const fetchCartItems = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartProducts([]);
      setTotalPrice(0);
      return;
    }

    if (cartProducts.length > 0) return;

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cart-items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.message === "Success") {
        const cartData = response.data.data;

        const totalPrice = Number(cartData.reduce((total, item) => total + (item.Quantity * item.Price), 0).toFixed(2));

        setTotalPrice(totalPrice);

        setCartProducts(cartData);

      }
    } catch (error) {
      setCartProducts([]);
      setTotalPrice(0);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const addProductToCart = async (productID, colorID, sizeID, quantity) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/cart-items",
        { productID, colorID, sizeID, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "Success") {
        await fetchCartItems();
        Swal.fire({
          title: "Thành công",
          text: "Đã thêm sản phẩm vào giỏ hàng",
          icon: "success",
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        title: "Lỗi",
        text: error.response?.data?.message || "ã có lỗi xảy ra",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const setQuantity = async (cartItemId, newQuantity) => {
    if (!cartItemId || newQuantity < 1) return;

    try {
      const cartItem = cartProducts.find(item => item.CartItemID === cartItemId);
      if (!cartItem) return;

      const currentVariantQuantity = cartItem.Quantity;

      if (newQuantity > currentVariantQuantity) {
        Swal.fire({
          title: "Lỗi",
          text: "Số lượng yêu cầu vượt quá số lượng có sẵn.",
          icon: "error",
        });
        return;
      }

      const updateData = {
        productID: cartItem.ProductID,
        sizeID: cartItem.SizeID,
        colorID: cartItem.ColorID,
        quantity: newQuantity,
      };

      await updateCartItem(cartItemId, updateData);

      setCartProducts(prev => 
        prev.map(item => 
          item.CartItemID === cartItemId ? { ...item, Quantity: newQuantity } : item
        )
      );

      await fetchCartItems();
    } catch (error) {
      console.error('Error setting quantity:', error);
    }
  };

  const updateCartItem = async (cartItemId, data) => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.patch(
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
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error updating cart:', error.response?.data);
      throw error;
    }
  };

  const removeSelectedItems = async () => {
    if (selectedItems.length === 0) return;
    const token = localStorage.getItem('token');
    const ids = selectedItems.join(','); 
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/cart-items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: { ids }, 
        }
      );

      setSelectedItems([]);
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể xóa sản phẩm khỏi giỏ hàng",
        icon: "error",
      });
    }
  };

  const removeCartItem = async () => {
    const token = localStorage.getItem('token');
    const ids = selectedItems.join(','); 
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/cart-items`, // Đảm bảo URL đúng
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: { ids },  // Gửi ID dưới dạng mảng
        }
      ); // Cập nhật giỏ hàng sau khi xóa
    } catch (error) {
        console.error('Error removing item from cart:', error);
        Swal.fire({
            title: "Lỗi",
            text: "Không thể xóa sản phẩm khỏi giỏ hàng",
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

      if (response.status === 201) {
        await fetchWishlistItems();
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const fetchWishlistItems = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setIsLoadingWishlist(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/api/wishlist",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "Success") {
        setWishlistProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistProducts([]);
    } finally {
      setIsLoadingWishlist(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  const removeFromWishlist = async (wishlistId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setIsLoadingWishlist(true);
      setWishlistProducts(prev => 
        prev.filter(item => item.WishlistID !== wishlistId)
      );

      await axios.delete(
        `http://127.0.0.1:8000/api/wishlist/${wishlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      await fetchWishlistItems();
      
      if (error.response?.status === 404) {
        Swal.fire({
          title: "Thông báo",
          text: "Không tìm thấy sản phẩm trong danh sách yêu thích",
          icon: "info",
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: "Lỗi",
          text: "Không thể xóa sản phẩm",
          icon: "error",
        });
      }
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const isProductInWishlist = useCallback((productId) => {
    return wishlistProducts.some(item => 
      parseInt(item.ProductID) === parseInt(productId)
    );
  }, [wishlistProducts]);

  const isInWishlist = useCallback((productId) => {
    return wishlistProducts.some(item => 
      parseInt(item.ProductID) === parseInt(productId)
    );
  }, [wishlistProducts]);

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
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};