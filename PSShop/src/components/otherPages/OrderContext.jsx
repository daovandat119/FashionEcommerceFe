import  { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// Tạo context
export const OrderContext = createContext();

// Tạo một component provider
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState({ data: [], totalAmount: 0 });
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
        
        setOrders({ data: response.data.data || [], totalAmount: 0 });
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

// Định nghĩa kiểu dữ liệu cho props
OrderProvider.propTypes = {
  children: PropTypes.node.isRequired, // Xác định children là một node và là bắt buộc
};