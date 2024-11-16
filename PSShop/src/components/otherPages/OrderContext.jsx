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

  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem('token');
    const orderStatusID = 3; // Giả sử 3 là ID cho trạng thái "Đã hủy"

    try {
      // Gọi API để cập nhật trạng thái đơn hàng
      await axios.post(`http://127.0.0.1:8000/api/order/status/${orderId}`, {
        OrderStatusID: orderStatusID, // Gửi OrderStatusID
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Cập nhật trạng thái đơn hàng trong state
      setOrders(prevOrders => ({
        ...prevOrders,
        data: prevOrders.data.map(order =>
          order.OrderID === orderId ? { ...order, OrderStatus: 'Đã hủy' } : order
        ),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, loading, error, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

// Định nghĩa kiểu dữ liệu cho props
OrderProvider.propTypes = {
  children: PropTypes.node.isRequired, // Xác định children là một node và là bắt buộc
};