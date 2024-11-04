import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Context = createContext();

export const useContextElement = () => useContext(Context);

export default function ContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkboxes, setCheckboxes] = useState({
    free_shipping: false,
    flat_rate: false,
    local_pickup: false,
  });

  // Hàm xử lý chọn/bỏ chọn item
  const handleSelectAll = (checked) => {
    if (checked) {
      // Sử dụng CartItemID thay vì id
      const ids = cartProducts.map((item) => item.CartItemID);
      setSelectedItems(ids);
    } else {
      setSelectedItems([]);
    }
  };
  // Xử lý chọn/bỏ chọn item
  const handleSelectItem = (cartItemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(cartItemId)) {
        return prev.filter((id) => id !== cartItemId);
      } else {
        return [...prev, cartItemId];
      }
    });
  };

  // Tính tổng giá
  const calculateTotalPrice = (products) => {
    if (!products || products.length === 0) return 0;

    const total = products.reduce((total, product) => {
      const price = parseFloat(product.Price) || 0;
      const quantity = parseInt(product.Quantity) || 0;
      return total + price * quantity;
    }, 0);

    return total;
  };
  const formatPrice = (price) => {
    if (typeof price !== "number") return "0.00";
    return price.toFixed(2);
  };

  // Thêm function để lấy thông tin sản phẩm
  const getProductDetails = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  // Sửa lại endpoint và response mapping
  const getVariantDetails = async (variantId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/product-variants/${variantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching variant details:", error);
      return null;
    }
  };

  const fetchCartItems = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cart-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message === "Success") {
        const cartData = response.data.data;

        const detailedCartItems = await Promise.all(
          cartData.map(async (item) => {
            const productDetails = await getProductDetails(item.ProductID);
            const variantDetails = await getVariantDetails(item.VariantID);

            return {
              ...item,
              product_name: productDetails?.ProductName,
              MainImageURL: productDetails?.MainImageURL,
              color: variantDetails?.ColorName,
              size: variantDetails?.SizeName,
              Price: parseFloat(variantDetails?.Price || 0),
              total_price:
                parseFloat(variantDetails?.Price || 0) * item.Quantity,
            };
          })
        );

        console.log("Detailed Cart Items:", detailedCartItems);
        setCartProducts(detailedCartItems);
        const total = calculateTotalPrice(detailedCartItems);
        setTotalPrice(total);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartProducts([]);
      setTotalPrice(0);
    }
  }, []);

  // Thêm sản phẩm vào giỏ
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
      return response;
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        title: "Lỗi",
        text: error.response?.data?.message || "Đã có lỗi xảy ra",
        icon: "error",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };


  // Sửa lại hàm setQuantity
const setQuantity = async (cartItemId, newQuantity) => {
  if (!cartItemId || newQuantity < 1) return;

  try {
    const cartItem = cartProducts.find(item => item.CartItemID === cartItemId);
    if (!cartItem) return;

    const variantDetails = await getVariantDetails(cartItem.VariantID);
    
    const updateData = {
      productID: cartItem.ProductID,
      sizeID: variantDetails.SizeID,
      colorID: variantDetails.ColorID,
      quantity: newQuantity
    };

    await updateCartItem(cartItemId, updateData);
    await fetchCartItems();
  } catch (error) {
    console.error('Error setting quantity:', error);
  }
};

// Sửa lại hàm updateCartItem
const updateCartItem = async (cartItemId, data) => {
  const token = localStorage.getItem('token');
  
  try {
    await axios.patch(
      `http://127.0.0.1:8000/api/cart-items/${cartItemId}`,
      {
        productID: data.productID,
        sizeID: data.sizeID,
        colorID: data.colorID,
        quantity: data.quantity
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error updating cart:', error.response?.data);
    throw error;
  }
};

// Sửa lại hàm xóa nhiều sản phẩm
const removeSelectedItems = async () => {
  if (selectedItems.length === 0) return;
  const token = localStorage.getItem('token');

  try {
    await axios.delete(
      `http://127.0.0.1:8000/api/cart-items/${selectedItems[0]}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { ids: selectedItems }
      }
    );
    
    setSelectedItems([]);
    await fetchCartItems();
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};

// Sửa lại hàm xóa một sản phẩm
const removeCartItem = async (cartItemId) => {
  const token = localStorage.getItem('token');

  try {
    await axios.delete(
      `http://127.0.0.1:8000/api/cart-items/${cartItemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { ids: [cartItemId] }
      }
    );

    await fetchCartItems();
  } catch (error) {
    console.error('Error removing item from cart:', error);
  }
};




  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [id]: checked,
    }));
  };

  // Wishlist functions
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("wishList", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const isAddedtoWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishList");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

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
    wishlist,
    removeCartItem,
    toggleWishlist,
    isAddedtoWishlist,
    handleSelectItem, // Đảm bảo export function này
    handleSelectAll, // Đảm bảo export function này
    selectedItems, // Đảm bảo export state này
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
