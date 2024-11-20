import { useContext, useState } from "react";
import { OrderContext } from "./OrderContext";
import axios from "axios";
import PropTypes from 'prop-types';
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";



export default function AccountOrders() {

  const { orders, loading, error, handleOrderAction, setOrders } = useContext(OrderContext);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderProducts, setOrderProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

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
      toast.warning("Vui lòng chọn lý do hủy đơn hàng");
      return;
    }

    try {
      // Cập nhật UI trước
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.OrderID === currentOrderId 
            ? { 
                ...order, 
                OrderStatus: "Đã hủy", 
                PaymentStatus: "Chưa thanh toán",
                CancellationReason: reason // Thêm lý do hủy vào state
              }
            : order
        )
      );

      // Gọi API cập nhật kèm lý do hủy
      await handleOrderAction(currentOrderId, "Đã hủy", "Chưa thanh toán", reason);
      
      setShowFeedbackModal(false);
      setSelectedReason('');
      setOtherReason('');
      toast.success("Hủy đơn hàng thành công");
    } catch (error) {
      // Nếu có lỗi, rollback lại trạng thái cũ
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.OrderID === currentOrderId 
            ? { ...order, OrderStatus: "Đang xử lý", CancellationReason: null }
            : order
        )
      );
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
    }
  };

  const handleReceiveOrder = async (orderId) => {
    try {
      // Cập nhật UI trước
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.OrderID === orderId 
            ? { ...order, OrderStatus: "Đã giao hàng", PaymentStatus: "Đã thanh toán", IsConfirmed: true }
            : order
        )
      );

      // Gọi API cập nhật
      await handleOrderAction(orderId, "Đã giao hàng", "Đã thanh toán");
      
      // Mở modal đánh giá
      setSelectedOrderForReview(orderId);
      setShowReviewModal(true);
    } catch (error) {
      // Nếu có lỗi, rollback lại trạng thái cũ
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.OrderID === orderId 
            ? { ...order, OrderStatus: "Đang giao hàng", IsConfirmed: false }
            : order
        )
      );
      console.error("Lỗi khi xác nhận nhận hàng:", error);
      toast.error("Có lỗi xảy ra khi xác nhận nhận hàng");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      toast.warning("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://127.0.0.1:8000/api/reviews`,
        {
          orderId: selectedOrderForReview,
          rating,
          comment: reviewComment
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Đánh giá thành công!");
      setShowReviewModal(false);
      setRating(5);
      setReviewComment('');
      setSelectedOrderForReview(null);
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      toast.error("Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  const OrderActionButton = ({ order }) => {
    if (order.OrderStatus === "Đang giao hàng") {
      return (
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-lg text-sm transition"
        >
          LIÊN HỆ NGƯỜI BÁN
        </button>
      );
    }

    if (order.OrderStatus === "Đã giao hàng" && !order.IsConfirmed) {
      return (
        <button 
          className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-lg text-sm transition"
          onClick={() => handleReceiveOrder(order.OrderID)}
        >
          XÁC NHẬN NHẬN HÀNG
        </button>
      );
    }

    if (order.OrderStatus === "Đã giao hàng" && order.IsConfirmed) {
      return (
        <button 
          className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-4 rounded-lg text-sm transition"
          onClick={() => {
            setSelectedOrderForReview(order.OrderID);
            setShowReviewModal(true);
          }}
        >
          ĐÁNH GIÁ
        </button>
      );
    }

    if (order.OrderStatus === "Đang xử lý") {
      return (
        <button 
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-lg text-sm transition"
          onClick={() => handleCancelOrder(order.OrderID)}
        >
          HỦY ĐƠN
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
      IsConfirmed: PropTypes.bool,
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

  // Tách riêng hàm đóng modal đánh giá
  

  // Tách riêng hàm đóng modal hủy đơn
  const handleCloseCancelModal = () => {
    setShowFeedbackModal(false);
    setSelectedReason('');
    setOtherReason('');
    setCurrentOrderId(null);
  };

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
                        Đơn hàng <span className="text-blue-500">#{order.OrderCode}</span>
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

      {/* Modal đánh giá */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Đánh giá đơn hàng</h3>
              <button 
                onClick={() => {
                  setShowReviewModal(false);
                  setRating(5);
                  setReviewComment('');
                  setSelectedOrderForReview(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Star Rating */}
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Đánh giá:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Nhận xét của bạn:
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows="4"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setRating(5);
                  setReviewComment('');
                  setSelectedOrderForReview(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Đóng
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal hủy đơn */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Lý do hủy đơn hàng</h3>
              <button 
                onClick={handleCloseCancelModal}  
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
                onClick={handleCloseCancelModal}  
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Đóng
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