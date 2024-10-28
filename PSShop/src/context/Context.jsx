/* eslint-disable react/prop-types */
import  { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Tạo DataContext
const Context = createContext();

// Tạo hook để sử dụng context
// eslint-disable-next-line react-refresh/only-export-components
export const useContextElement = () => useContext(Context);

export default function ContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Hàm fetch cart items với useCallback
  const fetchCartItems = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/cart-items', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.message === 'Success') {
        setCartProducts(response.data.data || []);
        // Tính tổng tiền
        const total = (response.data.data || []).reduce((sum, item) => {
          return sum + (item.Price * item.Quantity);
        }, 0);
        setTotalPrice(total);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartProducts([]);
      setTotalPrice(0);
    }
  }, []);

<<<<<<< HEAD
  // Cập nhật giỏ hàng tự động
  useEffect(() => {
    fetchCartItems();
    const interval = setInterval(fetchCartItems, 5000);
    return () => clearInterval(interval);
  }, [fetchCartItems]);

  // Hàm thêm sản phẩm vào giỏ
  const addProductToCart = async (productID, colorID, sizeID, quantity) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/cart-items',
        {
          productID,
          colorID,
          sizeID,
          quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === 'Success') {
        await fetchCartItems();
        Swal.fire({
          title: "Thành công",
          text: "Đã thêm sản phẩm vào giỏ hàng",
          icon: "success",
          timer: 1500
        });
      }
      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      Swal.fire({
        title: "Lỗi",
        text: error.response?.data?.message || "Đã có lỗi xảy ra",
        icon: "error"
      });
      throw error;
    } finally {
      setLoading(false);
=======
  // Lấy dữ liệu wishlist từ localStorage khi component mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishList");
    if (storedWishlist) {
      setWishList(JSON.parse(storedWishlist));
>>>>>>> 9b73a363ba8f8ca450418995339b2d6df0b6536d
    }
  };

<<<<<<< HEAD
  // Hàm cập nhật số lượng
  const updateCartItem = async (cartItemId, updates) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/cart-items/${cartItemId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
=======
>>>>>>> 9b73a363ba8f8ca450418995339b2d6df0b6536d

      if (response.data.message === 'Success') {
        await fetchCartItems();
        Swal.fire({
          title: "Thành công",
          text: "Đã cập nhật giỏ hàng",
          icon: "success",
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      Swal.fire({
        title: "Lỗi",
        text: error.response?.data?.message || "Đã có lỗi xảy ra",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa sản phẩm
  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/cart-items/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.message === 'Success') {
        await fetchCartItems();
        Swal.fire({
          title: "Thành công",
          text: "Đã xóa sản phẩm khỏi giỏ hàng",
          icon: "success",
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      Swal.fire({
        title: "Lỗi",
        text: error.response?.data?.message || "Đã có lỗi xảy ra",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const isAddedtoWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const value = {
    cartProducts,
    totalPrice,
    loading,
    addProductToCart,
    updateCartItem,
    removeFromCart,
    fetchCartItems,
    wishlist,
    toggleWishlist,
    isAddedtoWishlist
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
