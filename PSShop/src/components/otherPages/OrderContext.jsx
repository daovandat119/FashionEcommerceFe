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
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/order/views', 
          {
            // Có thể thêm các filter nếu cần
            // OrderStatusID: null,
            // PaymentMethodID: null,
            // PaymentStatusID: null,
            // OrderCode: null
          }, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
        
        if (response.data.data) {
          // Tính tổng tiền từ tất cả đơn hàng nếu cần
          const total = response.data.data.reduce((sum, order) => sum + (order.TotalAmount || 0), 0);
          setOrders({ 
            data: response.data.data, 
            totalAmount: total 
          });
        }
      } catch (err) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]); // Chỉ gọi lại khi token thay đổi

  const cancelOrder = async (orderId) => {
    if (!token) return;

    try {
      await axios.post(`http://127.0.0.1:8000/api/order/status/${orderId}`, 
        {
          OrderStatusID: 3, // ID trạng thái "Đã hủy"
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // Cập nhật lại danh sách đơn hàng sau khi hủy
      setOrders(prevOrders => ({
        ...prevOrders,
        data: prevOrders.data.map(order =>
          order.OrderID === orderId 
            ? { ...order, OrderStatus: 'Đã hủy', OrderStatusID: 3 } 
            : order
        ),
      }));
    } catch (err) {
      console.error('Lỗi khi hủy đơn hàng:', err);
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