import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Tạo context
export const OrderContext = createContext();

// Tạo một component provider
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');  // Lấy token từ local storage

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/order', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log("Dữ liệu đơn hàng từ API:", response.data);
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <OrderContext.Provider value={{ orders, loading, error }}>
      {children}
    </OrderContext.Provider>
  );
};
