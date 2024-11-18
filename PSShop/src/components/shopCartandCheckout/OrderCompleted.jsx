import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaMoneyBill,
  FaCreditCard,
} from "react-icons/fa";

export default function OrderCompleted() {
  const [orderDetails, setOrderDetails] = useState([]);
  const [addressInfo, setAddressInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const token = localStorage.getItem("token");

  const location = useLocation();
  const paymentMethod = location.state?.paymentMethod; // Lấy paymentMethod từ state

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

        const addressResponse = await axios.get(
          "http://127.0.0.1:8000/api/address",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const defaultAddress =
          addressResponse.data.data.find((addr) => addr.IsDefault === 1) ||
          addressResponse.data.data[0];
        setAddressInfo(defaultAddress);
      } catch (error) {
        console.error("Lỗi khi tải thông tin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, token]);

  const calculateTotal = () => {
    return orderDetails.reduce((sum, item) => sum + Number(item.TotalPrice), 0);
  };

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

      {/* Phương thức thanh toán */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaMoneyBill className="mr-2 text-gray-600" />
          Phương thức thanh toán
        </h2>
        <div className="space-y-2 text-gray-600">
          <p className="flex items-center">
            <FaCreditCard className="mr-2" />
            {paymentMethod === 2
              ? "Thanh toán khi nhận hàng (COD)"
: "Thanh toán qua VNPAY"}
          </p>
          <p className="ml-6 text-sm text-gray-500">
            {paymentMethod === 1
              ? `Vui lòng chuẩn bị số tiền mặt ${(calculateTotal() + 19).toFixed(2)}$ khi nhận hàng`
              : "Vui lòng chuyển khoản theo thông tin tài khoản được cung cấp"}
          </p>
        </div>
      </div> */}

      {/* Thông tin giao hàng */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-gray-600" />
          Địa chỉ giao hàng
        </h2>
        <div className="space-y-2 text-gray-600">
          <p className="flex items-center">
            <FaUser className="mr-2" />
            {addressInfo?.Username}
          </p>
          <p className="flex items-center">
            <FaPhone className="mr-2" />
            {addressInfo?.PhoneNumber}
          </p>
          <p className="ml-6">{addressInfo?.Address}</p>
          {addressInfo?.IsDefault === 1 && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              Địa chỉ mặc định
            </span>
          )}
        </div>
      </div>

      {/* Chi tiết đơn hàng */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Sản phẩm</th>
                <th className="text-center py-3 px-4">Màu sắc</th>
                <th className="text-center py-3 px-4">Kích thước</th>
                <th className="text-center py-3 px-4">Số lượng</th>
                <th className="text-center py-3 px-4">Đơn giá</th>
                <th className="text-right py-3 px-4">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium">{item.ProductName}</span>
                  </td>
                  <td className="text-center py-3 px-4">{item.VariantColor}</td>
                  <td className="text-center py-3 px-4">{item.VariantSize}</td>
                  <td className="text-center py-3 px-4">
                    {item.TotalQuantity}
                  </td>
                  <td className="text-center py-3 px-4">
                    {Number(item.VariantPrice).toFixed(2)} VND
                  </td>
                  <td className="text-right py-3 px-4 font-medium">
                    {Number(item.TotalPrice).toFixed(2)} VND
                  </td>
                </tr>
              ))}
            </tbody>
</table>
        </div>

        {/* Tổng cộng */}
        <div className="mt-6 space-y-2 border-t pt-4">
          <div className="flex justify-end text-gray-600 space-x-20">
            <span>Tạm tính:</span>
            <span className="w-32 text-right">
              {calculateTotal().toFixed(2)} VND
            </span>
          </div>
          <div className="flex justify-end text-gray-600 space-x-20">
            <span>Phí vận chuyển & VAT:</span>
            <span className="w-32 text-right">19.00 VND</span>
          </div>
          <div className="flex justify-end text-xl font-bold pt-4 border-t space-x-20">
            <span>Tổng cộng:</span>
            <span className="w-32 text-right">
              {(calculateTotal() + 19).toFixed(2)} VND
            </span>
          </div>
        </div>
      </div>

      {/* Nút tiếp tục mua sắm */}
      <div className="text-center mt-8">
        <a
          href="/"
          className="inline-block bg-gray-800 text-white px-8 py-3 rounded-md hover:bg-gray-900 transition-colors"
        >
          Tiếp tục mua sắm
        </a>
      </div>
    </div>
  );
}