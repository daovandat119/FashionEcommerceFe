import { useContext, useState } from "react";
import { OrderContext } from "./OrderContext";
import axios from "axios";
import PropTypes from 'prop-types';



export default function AccountOrders() {
  const { orders, loading, error, handleOrderAction } = useContext(OrderContext);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderProducts, setOrderProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const OrderActionButton = ({ order }) => {
    if (["Đã giao hàng", "Đã hủy", "Đang giao hàng"].includes(order.OrderStatus)) {
      return (
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-lg text-sm transition"
          onClick={() => {/* Xử lý liên hệ */}}
        >
          LIÊN HỆ
        </button>
      );
    }

    const isConfirmable = order.OrderStatus === "Đang xử lý" && order.PaymentStatus === "Đã thanh toán";
    
    return (
      <button 
        onClick={() => handleOrderAction(order.OrderID, order.OrderStatus, order.PaymentStatus)}
        className={`py-1 px-4 rounded-lg text-sm text-white transition ${
          isConfirmable ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
        }`}
      >
        {isConfirmable ? "XÁC NHẬN ĐƠN" : "HỦY ĐƠN HÀNG"}
      </button>
    );
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

  if (loading) {
    return <p className="text-center text-lg font-medium text-gray-600">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-green-500 text-lg font-semibold">Error: {error}</p>;
  }

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.data.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.data.length / itemsPerPage);

  return (
    <div className="col-lg-9">
      <div className="page-content my-account__orders-list bg-gray-50 py-8 px-6 rounded-lg shadow-md font-sans text-gray-800">
        {currentOrders.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-3">Danh sách đơn hàng</h2>
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
                      <span className="text-black-600">{order.TotalAmount} VND</span>
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

            <div className="flex justify-center mt-6">
              {Array.from({ length: totalPages }, (_, index) => (
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
          </div>
        ) : (
          <p className="text-center text-lg font-medium text-gray-600">
            Không có đơn hàng nào.
          </p>
        )}
      </div>
    </div>
  );
}