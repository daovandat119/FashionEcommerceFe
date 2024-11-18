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
        const sortedOrders = response.data.data.sort((a, b) => 
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

  const updateOrderStatus = async (orderId, newStatusId) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/order/status/${orderId}`,
        {
          OrderStatusID: newStatusId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      await fetchOrders();
      return true;
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
      setError("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getNewStatusId = (currentStatus, paymentStatus) => {
    if (currentStatus === "Đang xử lý" && paymentStatus === "Đã thanh toán") {
      return 2;
    }
    return 4;
  };

  const handleOrderAction = async (orderId, currentStatus, paymentStatus) => {
    const newStatusId = getNewStatusId(currentStatus, paymentStatus);
    return await updateOrderStatus(orderId, newStatusId);
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
    updateOrderStatus
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