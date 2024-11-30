// src/hooks/useCart.js

import { useState } from 'react';

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  return {
    cartItems,
    addToCart,  
    removeFromCart,
    clearCart,
    getTotal,
  };
};

export default useCart;
