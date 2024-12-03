import { useContext, useState } from "react";
import { OrderContext } from "./OrderContext";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AccountOrders() {
  const { orders, loading, error, handleOrderAction, setOrders, fetchOrders } =
    useContext(OrderContext);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderProducts, setOrderProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const cancelReasons = [
    "Muốn thay đổi địa chỉ giao hàng",
    "Muốn thay đổi sản phẩm trong đơn hàng",
    "Tìm thấy giá rẻ hơn ở nơi khác",
    "Thay đổi ý định mua hàng",
    "Khác",
  ];

  const handleStatusChange = async (e) => {
    const statusId = e.target.value;
    setSelectedStatus(statusId);
    setCurrentPage(1);

    try {
      if (statusId === "all") {
        await fetchOrders();
      } else {
        await fetchOrders({
          OrderStatusID: Number(statusId),
        });
      }
    } catch (error) {
      console.error("Lỗi khi lọc đơn hàng:", error);
      toast.error("Có lỗi xảy ra khi lọc đơn hàng");
    }
  };

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
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === currentOrderId
            ? {
                ...order,
                OrderStatus: "Đã hủy",
                PaymentStatus: "Chưa thanh toán",
                CancellationReason: reason, // Thêm lý do hủy vào state
              }
            : order
        )
      );

      // Gọi API cập nhật kèm lý do hủy
      await handleOrderAction(currentOrderId, 4, "Chưa thanh toán", reason);

      setShowFeedbackModal(false);
      setSelectedReason("");
      setOtherReason("");
      toast.success("Hủy đơn hàng thành công");
    } catch (error) {
      // Nếu có lỗi, rollback lại trạng thái cũ
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
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
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === orderId
            ? {
                ...order,
                OrderStatus: "Đã hoàn thành",
                PaymentStatus: "Đã thanh toán",
                IsConfirmed: true,
              }
            : order
        )
      );

      // Gọi API cập nhật với OrderStatusID là 5
      await handleOrderAction(orderId, 5, "Đã thanh toán");

      // Mở modal đánh giá
      setSelectedOrderForReview(orderId);
      setShowReviewModal(true);
    } catch (error) {
      // Nếu có lỗi, rollback lại trạng thái cũ
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
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
        `http://127.0.0.1:8000/api/order/review`,
        {
          OrderID: selectedOrderForReview,
          RatingLevelID: rating,
          Review: reviewComment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cập nhật state orders để thêm đánh giá vào đơn hàng
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === selectedOrderForReview
            ? { ...order, Rating: rating, Review: reviewComment }
            : order
        )
      );

      toast.success("Đánh giá thành công!");
      setShowReviewModal(false);
      setRating(5);
      setReviewComment("");
      setSelectedOrderForReview(null);
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      toast.error("Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  const handleRepurchase = async (orderId) => {
    try {
      const products = orderProducts[orderId];
      if (!products) {
        await fetchOrderProducts(orderId);
      }

      // Thêm từng sản phẩm vào giỏ hàng
      const token = localStorage.getItem("token");
      for (const product of orderProducts[orderId]) {
        await axios.post(
          "http://127.0.0.1:8000/api/cart/add",
          {
            productId: product.ProductID,
            quantity: product.TotalQuantity,
            color: product.VariantColor,
            size: product.VariantSize,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      toast.success("Đã thêm sản phẩm vào giỏ hàng");
      // Chuyển hưng đến trang giỏ hàng
      window.location.href = "/cart";
    } catch (error) {
      console.error("Lỗi khi mua lại:", error);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
    }
  };

  const OrderActionButton = ({ order }) => {
    if (
      order.OrderStatus === "Đã hoàn thành" ||
      order.OrderStatus === "Đã hủy"
    ) {
      return (
        <div className="flex gap-2">
          <button
            className="bg-yellow-500 text-white py-2 px-6 rounded-lg text-sm font-medium focus:outline-none"
            onClick={() => handleRepurchase(order.OrderID)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 inline-block mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            MUA LẠI
          </button>

          {!order.Rating && order.OrderStatus === "Đã hoàn thành" && (
            <button
              className="bg-purple-500 text-white py-2 px-6 rounded-lg text-sm font-medium focus:outline-none"
              onClick={() => {
                setSelectedOrderForReview(order.OrderID);
                setShowReviewModal(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline-block mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              ĐÁNH GIÁ
            </button>
          )}
        </div>
      );
    }

    if (order.OrderStatus === "Đang xử lý") {
      return (
        <div className="relative inline-block">
          <button
            className="bg-red-500 text-white py-2 px-6 rounded-lg text-sm font-medium focus:outline-none"
            onClick={() => handleCancelOrder(order.OrderID)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 inline-block mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            HỦY ĐƠN
          </button>

          {showFeedbackModal && currentOrderId === order.OrderID && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Lý do hủy đơn
                </h3>

                <div className="space-y-3 mb-6">
                  {cancelReasons.map((reason) => (
                    <div
                      key={reason}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                        ${
                          selectedReason === reason
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-red-200 hover:bg-red-50"
                        }`}
                      onClick={() => setSelectedReason(reason)}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${
                          selectedReason === reason
                            ? "border-red-500"
                            : "border-gray-400"
                        }`}
                      >
                        {selectedReason === reason && (
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        )}
                      </div>
                      <label className="flex-1 text-sm text-gray-700 cursor-pointer">
                        {reason}
                      </label>
                    </div>
                  ))}
                </div>

                {selectedReason === "Khác" && (
                  <div className="mb-6">
                    <textarea
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      placeholder="Vui lòng chia sẻ lý do của bạn..."
                      className="w-full p-4 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                      rows="3"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 focus:outline-none"
                    onClick={handleCloseCancelModal}
                  >
                    Đóng
                  </button>
                  <button
                    className="px-5 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg focus:outline-none"
                    onClick={handleSubmitCancelOrder}
                  >
                    Xác nhận hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (order.OrderStatus === "Đã giao hàng" && !order.IsConfirmed) {
      return (
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
          onClick={() => handleReceiveOrder(order.OrderID)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          XÁC NHẬN NHẬN HÀNG
        </button>
      );
    }

    if (order.OrderStatus === "Đã hoàn thành") {
      return (
        <div className="flex gap-2">
          {!order.Rating && (
            <button
              className="bg-purple-500 text-white py-2 px-6 rounded-lg text-sm font-medium focus:outline-none"
              onClick={() => {
                setSelectedOrderForReview(order.OrderID);
                setShowReviewModal(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline-block mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              ĐÁNH GIÁ
            </button>
          )}
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
            onClick={() => handleRepurchase(order.OrderID)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            MUA LẠI
          </button>
        </div>
      );
    }

    if (order.OrderStatus === "Đã hủy") {
      return (
        <div className="flex gap-2">
          <Link to="/contact">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              LIÊN HỆ NGƯỜI BÁN
            </button>
          </Link>
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
            onClick={() => handleRepurchase(order.OrderID)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            MUA LẠI
          </button>
        </div>
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
        "Đã hủy",
        "Đã hoàn thành",
      ]).isRequired,
      PaymentStatus: PropTypes.string,
      IsConfirmed: PropTypes.bool,
      Rating: PropTypes.number,
      Review: PropTypes.string,
    }).isRequired,
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

  const handleCloseCancelModal = () => {
    setShowFeedbackModal(false);
    setSelectedReason("");
    setOtherReason("");
    setCurrentOrderId(null);
  };

  return (
    <>
      <div className="col-lg-9">
        <div className="page-content my-account__orders-list bg-gray-50 py-8 px-6 rounded-lg shadow-md font-sans text-gray-800">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Đơn hàng của tôi
              </h2>

              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 
                         hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 text-gray-700 cursor-pointer"
                >
                  <option value="all">Tất cả đơn hàng</option>
                  <option value="1">Đang xử lý</option>
                  <option value="2">Đang giao hàng</option>
                  <option value="3">Đã giao hàng</option>
                  <option value="4">Đã hủy</option>
                  <option value="5">Đã hoàn thành</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
              </div>
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
                          Đơn hàng{" "}
                          <span className="text-blue-500">
                            #{order.OrderCode}
                          </span>
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
                              order.OrderStatus === "Đã hoàn thành"
                                ? "bg-green-500"
                                : order.OrderStatus === "Đã giao hàng"
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
                          <span className="font-medium">Số lượng:</span>{" "}
                          {order.TotalQuantity}
                        </p>
                        <p>
                          <span className="font-medium">
                            Phương thức thanh toán:
                          </span>{" "}
                          {order.PaymentMethod}
                        </p>
                        <p>
                          <span className="font-medium">
                            Trạng thái thanh toán:
                          </span>{" "}
                          {order.PaymentStatus}
                        </p>
                        <p>
                          <span className="font-medium">Địa chỉ:</span>{" "}
                          {order.ShippingAddress}
                        </p>
                        <p>
                          <span className="font-medium">Ngày mua:</span>{" "}
                          {order.OrderDate}
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
                                      <span className="font-medium">
                                        Số lượng:
                                      </span>{" "}
                                      {product.TotalQuantity} |{" "}
                                      <span className="font-medium">Màu:</span>{" "}
                                      {product.VariantColor} |{" "}
                                      <span className="font-medium">
                                        Kích thước:
                                      </span>{" "}
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
                          <p className="text-sm text-gray-500">
                            Tổng tiền:{" "}
                            <span className="text-black-600">
                              {order.TotalProductAmount} VND
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Phí vận chuyển:{" "}
                            <span className="text-black-600">
                              {order.ShippingFee} VND
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Giảm giá:{" "}
                            <span className="text-black-600">
                              -{order.Discount} VND
                            </span>
                          </p>
                          <p className="text-lg font-bold text-gray-800">
                            Tổng tiền:{" "}
                            <span className="text-black-600">
                              {order.TotalAmount} VND
                            </span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <OrderActionButton order={order} />
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

      {/* Form đánh giá */}
      {showReviewModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Đánh giá đơn hàng
            </h3>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-lg font-medium text-gray-700">
                  Mức độ hài lòng của bạn
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-colors ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      } hover:scale-110`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium text-gray-700 block">
                  Nhận xét của bạn
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm mua hàng của bạn..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] text-gray-700 resize-none"
                  rows="4"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setRating(5);
                  setReviewComment("");
                  setSelectedOrderForReview(null);
                }}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}