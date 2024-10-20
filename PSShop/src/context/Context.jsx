/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useEffect, useContext, useState } from "react";

// Tạo DataContext
const DataContext = React.createContext();

// Tạo hook để sử dụng context
export const useContextElement = () => {
  return useContext(DataContext);
};

export default function ContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Tính tổng giá khi giỏ hàng thay đổi
  useEffect(() => {
    const total = cartProducts.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);
    setTotalPrice(total);
  }, [cartProducts]);

  // Thêm sản phẩm vào giỏ hàng
  const addProductToCart = async (productId, colorId, sizeId, quantity) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/cart-items`,
        {
          productID: productId,
          colorID: colorId,
          sizeID: sizeId,
          quantity: quantity,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Đảm bảo dữ liệu trả về từ backend là một mảng
      const updatedCart = Array.isArray(response.data) ? response.data : [];
      setCartProducts(updatedCart);
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  // Kiểm tra sản phẩm đã được thêm vào giỏ hàng
  const isAddedToCartProducts = (id) => {
    return cartProducts.some((product) => product.id === id);
  };

  // Thêm hoặc xóa sản phẩm khỏi wishlist
  const toggleWishlist = (id) => {
    setWishList((prevWishList) =>
      prevWishList.includes(id)
        ? prevWishList.filter((productId) => productId !== id)
        : [...prevWishList, id]
    );
  };

  // Kiểm tra sản phẩm trong wishlist
  const isAddedtoWishlist = (id) => {
    return wishList.includes(id);
  };

  // Lấy dữ liệu giỏ hàng từ localStorage khi component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cartProducts");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      // Kiểm tra xem parsedCart có phải là mảng không
      if (Array.isArray(parsedCart)) {
        setCartProducts(parsedCart);
      } else {
        setCartProducts([]); // Nếu không phải là mảng, khởi tạo thành mảng rỗng
      }
    }
  }, []);

  // Lưu dữ liệu giỏ hàng vào localStorage khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  }, [cartProducts]);

  // Lấy dữ liệu wishlist từ localStorage khi component mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishList");
    if (storedWishlist) {
      setWishList(JSON.parse(storedWishlist));
    }
  }, []);

  // Lưu dữ liệu wishlist vào localStorage khi wishlist thay đổi
  useEffect(() => {
    localStorage.setItem("wishList", JSON.stringify(wishList));
  }, [wishList]);

  // Tạo đối tượng context để truyền cho Provider
  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    isAddedToCartProducts,
    toggleWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
  };

  return (
    <DataContext.Provider value={contextElement}>
      {children}
    </DataContext.Provider>
  );
}
