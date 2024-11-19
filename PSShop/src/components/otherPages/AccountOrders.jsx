import { useContext, useState } from "react";
import { OrderContext } from "./OrderContext";
import axios from "axios";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";



export default function AccountOrders() {
  const navigate = useNavigate();
  const { orders, loading, error,handleOrderAction } = useContext(OrderContext);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderProducts, setOrderProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const cancelReasons = [
    "Muốn thay đổi địa chỉ giao hàng",
    "Muốn thay đổi sản phẩm trong đơn hàng",
    "Tìm thấy giá rẻ hơn ở nơi khác",
    "Thay đổi ý định mua hàng",
    "Khác"
  ];

  const handleCancelOrder = (orderId) => {
    setCurrentOrderId(orderId);
    setShowFeedbackModal(true);
  };

  const handleSubmitCancelOrder = async () => {
    const reason = selectedReason === "Khác" ? otherReason : selectedReason;
    
    if (!reason) {
      alert("Vui lòng chọn lý do hủy đơn hàng");
      return;
    }

    try {
      await handleOrderAction(currentOrderId, "Đang xử lý", "Chưa thanh toán", reason);
      setShowFeedbackModal(false);
      setSelectedReason('');
      setOtherReason('');
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
  };

  const OrderActionButton = ({ order }) => {
    if (order.OrderStatus === "Đã giao hàng") {
      return (
        <div className="flex gap-2">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-lg text-sm transition"
            onClick={() => {/* Xử lý liên hệ */}}
          >
            LIÊN HỆ
          </button>
          <button 
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded-lg text-sm transition"
            onClick={() => navigate(`/review/${order.OrderID}`)}
          >
            ĐÁNH GIÁ
          </button>
        </div>
      );
    }

    if (["Đang xử lý", "Đang giao hàng"].includes(order.OrderStatus)) {
      return (
        <div className="flex gap-2">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-lg text-sm transition"
            onClick={() => {/* Xử lý liên hệ */}}
          >
            LIÊN HỆ
          </button>
          <button 
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-lg text-sm transition"
            onClick={() => handleCancelOrder(order.OrderID)}
          >
            HỦY ĐƠN
          </button>
        </div>
      );
    }

    if (order.OrderStatus === "Đã hủy") {
      return (
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-lg text-sm transition"
          onClick={() => {/* Xử lý liên hệ */}}
        >
          LIÊN HỆ
        </button>
      );
    }

    return null;
  };

  OrderActionButton.propTypes = {
    order: PropTypes.shape({
      OrderID: PropTypes.number.isRequired,
      OrderStatus: PropTypes.oneOf([
        "Đang xử lý",
        "Đang giao hàng",
        "Đã giao hàng",
        "Đã hủy"
      ]).isRequired,
      PaymentStatus: PropTypes.oneOf([
        "Chưa thanh toán",
        "Đã thanh toán",
        "Thanh toán thất bại",
        null
      ]),
      TotalQuantity: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      TotalAmount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      PaymentMethod: PropTypes.string,
      PurchaseDate: PropTypes.string,
    }).isRequired
  };

  const fetchOrderProducts = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrderProducts((prev) => ({
        ...prev,
        [orderId]: response.data.data || [],
      }));
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
    }
  };

  const handleToggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
    if (expandedOrder !== orderId) {
      fetchOrderProducts(orderId);
    }
  };

  const getCurrentPageOrders = () => {
    if (!orders || orders.length === 0) return [];
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return orders.slice(startIndex, endIndex);
  };

  const totalPages = orders ? Math.ceil(orders.length / itemsPerPage) : 0;

  const currentOrders = getCurrentPageOrders();

  return (
    <>
      <div className="col-lg-9">
      <div className="page-content my-account__orders-list bg-gray-50 py-8 px-6 rounded-lg shadow-md font-sans text-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Đơn hàng của tôi</h2>
          {loading ? (
            <p className="text-center text-lg">Đang tải...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : orders && orders.length > 0 ? (
            <div>
              <div className="space-y-6">
                {currentOrders.map((order) => (
                  <div
                    key={order.OrderID}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-base"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-700">
                        Đơn hàng <span className="text-blue-500">#{order.OrderID}</span>
                      </h3>
                      <button
                        onClick={() => handleToggleOrder(order.OrderID)}
                        className="text-sm text-blue-600 hover:text-blue-800 transition font-medium"
                      >
                        {expandedOrder === order.OrderID ? "Ẩn " : "Xem thêm"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <span className="font-medium">Trạng thái:</span>{" "}
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-white text-xs ${
                            order.OrderStatus === "Đã giao hàng"
                              ? "bg-green-500"
                              : order.OrderStatus === "Đang giao hàng"
                              ? "bg-blue-500"
                              : order.OrderStatus === "Đang xử lý"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        >
                          {order.OrderStatus}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Số lượng:</span> {order.TotalQuantity}
                      </p>
                      <p>
                        <span className="font-medium">Phương thức thanh toán:</span> {order.PaymentMethod}
                      </p>
                      <p>
                        <span className="font-medium">Trạng thái thanh toán:</span> {order.PaymentStatus}
                      </p>
                    </div>

                    {expandedOrder === order.OrderID &&
                      orderProducts[order.OrderID] && (
                        <div className="mt-4 bg-gray-100 border border-gray-300 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-gray-800 border-b pb-3">
                            Danh sách sản phẩm
                          </h4>
                          <div className="mt-4 space-y-4">
                            {orderProducts[order.OrderID].map((product) => (
                              <div
                                key={`${product.ProductID}-${product.VariantColor}-${product.VariantSize}`}
                                className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md"
                              >
                                <img
                                  src={product.MainImageURL}
                                  alt={product.ProductName}
                                  className="w-20 h-20 object-cover rounded-md border"
                                />
                                <div className="flex-grow text-center">
                                  <h5 className="text-base font-bold text-gray-700 mb-2">
                                    {product.ProductName}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Số lượng:</span>{" "}
                                    {product.TotalQuantity} |{" "}
                                    <span className="font-medium">Màu:</span>{" "}
                                    {product.VariantColor} |{" "}
                                    <span className="font-medium">Kích thước:</span>{" "}
                                    {product.VariantSize} |{" "}
                                    <span className="font-medium">Giá:</span>{" "}
                                    {product.VariantPrice} VND
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    <div className="flex justify-between items-center mt-6">
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          Tổng tiền:{" "}
                          <span className="text-black-600">{order.TotalAmount } VND</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Ngày mua:{" "}
                          {new Date(order.PurchaseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <OrderActionButton 
                          order={order} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`mx-1 px-3 py-2 rounded-lg text-sm ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-lg font-medium text-gray-600">
              Không có đơn hàng nào.
            </p>
          )}
        </div>
      </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Lý do hủy đơn hàng</h3>
              <button 
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {cancelReasons.map((reason) => (
                <div key={reason} className="flex items-center">
                  <input
                    type="radio"
                    id={reason}
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mr-3"
                  />
                  <label htmlFor={reason} className="text-gray-700">
                    {reason}
                  </label>
                </div>
              ))}

              {selectedReason === "Khác" && (
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Vui lòng nhập lý do..."
                  className="w-full p-2 border border-gray-300 rounded-lg mt-2"
                  rows="3"
                />
              )}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitCancelOrder}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}