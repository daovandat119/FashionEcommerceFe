import { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from "axios";

export const OrderContext = createContext();

export function OrderProvider({ children = null }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async (filters = {}) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/order/views",
        {
          OrderCode: filters.OrderCode || null,
          OrderStatusID: filters.OrderStatusID || null,
          PaymentMethodID: filters.PaymentMethodID || null,
          PaymentStatusID: filters.PaymentStatusID || null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data.message === 'Success') {
        const sortedOrders = response.data.data.map(order => ({
          ...order,
        })).sort((a, b) => 
          new Date(b.OrderDate) - new Date(a.OrderDate)
        );
        
        setOrders(sortedOrders);
        setError(null);
      } else {
        setError("Không thể tải danh sách đơn hàng");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatusId, cancellationReason = null) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/order/status/${orderId}`,
        {
          OrderStatusID: newStatusId,
          CancellationReason: cancellationReason
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // console.log("API Response:", response.data);

      setLoading(false);
      return response.data.message === 'Success';
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
      setError("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.");
      setLoading(false);
      return false;
    }
  };

  const handleOrderAction = async (orderId, orderStatusId, paymentStatus, cancellationReason = null) => {
    try {
      // console.log("Order Status ID:", orderStatusId); // Kiểm tra giá trị

      // Cập nhật trạng thái đơn hàng kèm lý do hủy
      const success = await updateOrderStatus(orderId, orderStatusId, cancellationReason);
      
      if (success) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.OrderID === orderId 
              ? {
                  ...order,
                  OrderStatusID: orderStatusId,
                  PaymentStatus: paymentStatus,
                  CancellationReason: cancellationReason
                }
              : order
          )
        );
      }
      
      return success;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchOrders();
    }
  }, []);

  const contextValue = {
    orders,
    loading,
    error,
    fetchOrders,
    handleOrderAction,
    updateOrderStatus,
    setOrders
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
}

OrderProvider.propTypes = {
  children: PropTypes.node
};