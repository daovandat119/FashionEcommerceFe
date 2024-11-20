import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import axios from "axios";
import {
  FaCheckCircle,
} from "react-icons/fa";

export default function OrderCompleted() {
  const [orderDetails, setOrderDetails] = useState([]);

  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const token = localStorage.getItem("token");
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderResponse = await axios.get(
          `http://127.0.0.1:8000/api/order/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrderDetails(orderResponse.data.data);
      
       
        
      } catch (error) {
        console.error("Lỗi khi tải thông tin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, token]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div> 
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600">
          Mã đơn hàng: #{orderDetails[0]?.OrderID}
        </p>
        <p className={`text-lg font-semibold`}>
          Trạng thái: {orderDetails[0]?.OrderStatus}
        </p>
      </div>

      <div className="text-center mt-8 space-x-4">
        <a
          href="/"
          className="inline-block bg-gray-800 text-white px-8 py-3 rounded-md hover:bg-gray-900 transition-colors"
        >
          Tiếp tục mua sắm
        </a>
        <a
          href="/account_orders"
          className="inline-block bg-gray-800 text-white px-8 py-3 rounded-md hover:bg-gray-900 transition-colors"
        >
          Xem đơn hàng
        </a>
      </div>
    </div>
  );
}