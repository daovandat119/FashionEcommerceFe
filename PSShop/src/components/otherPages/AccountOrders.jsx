import { useContext, useState } from 'react';
import { OrderContext } from './OrderContext';
import axios from 'axios';

export default function AccountOrders() {
  const { orders, loading, error } = useContext(OrderContext);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderProducts, setOrderProducts] = useState({});
  
  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2
  ; // Số lượng đơn hàng trên mỗi trang

  const fetchOrderProducts = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/order/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setOrderProducts(prev => ({ ...prev, [orderId]: response.data.data || [] }));
    } catch (err) {
      console.error("Error fetching order products:", err);
    }
  };

  const handleToggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
    if (expandedOrder !== orderId) {
      fetchOrderProducts(orderId);
    }
  };

  if (loading) {
    return <p className="text-center">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  // Tính toán chỉ số bắt đầu và kết thúc cho trang hiện tại
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.data.slice(indexOfFirstOrder, indexOfLastOrder);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(orders.data.length / itemsPerPage);

  return (
    <div className="col-lg-9">
      <div className="page-content my-account__orders-list">
        {currentOrders.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Danh sách đơn hàng</h2>
            {currentOrders.map(order => (
              <div key={order.OrderID} className="border-b py-4">
                <h3 className="font-bold flex justify-between items-center">
                  Đơn hàng #{order.OrderID}
                  <button onClick={() => handleToggleOrder(order.OrderID)} className="text-blue-500">
                    {expandedOrder === order.OrderID ? 'Ẩn bớt' : 'Xem tất cả sản phẩm'}
                  </button>
                </h3>
                <p>Trạng thái: {order.OrderStatus}</p>
                <p>Số lượng: {order.TotalQuantity}</p>
                <p>Phương thức thanh toán: {order.PaymentMethod}</p>
                <p>Trạng thái thanh toán: {order.PaymentStatus}</p>

                {expandedOrder === order.OrderID && orderProducts[order.OrderID] && (
                  <div className="mt-2">
                    {/* Nhóm sản phẩm theo ProductID */}
                    {orderProducts[order.OrderID].map(product => (
                      <div key={`${product.ProductID}-${product.VariantColor}-${product.VariantSize}`} className="flex items-center py-2">
                        <img src={product.MainImageURL} alt={product.ProductName} className="w-20 h-20 object-cover mr-4" />
                        <div className="flex-grow">
                          <h4 className="font-bold">{product.ProductName}</h4>
                          {/* Hiển thị thông tin biến thể */}
                          <div className="text-gray-600">
                            <p>Số lượng: {product.TotalQuantity} | Màu: {product.VariantColor} | Kích thước: {product.VariantSize} | Giá: {product.VariantPrice} VND</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <div>
                    <p className="font-bold">Tổng tiền: {order.TotalAmount} VND</p>
                    <p className="text-gray-500">Ngày mua: {new Date(order.PurchaseDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <button className="bg-red-500 text-white py-1 px-2 rounded mr-2">HỦY ĐƠN HÀNG</button>
                    <button className="bg-yellow-500 text-white py-1 px-2 rounded">LIÊN HỆ NGƯỜI BÁN</button>
                  </div>
                </div>
              </div>
            ))}
            {/* Phân trang */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center">No orders found.</p>
        )}
      </div>
    </div>
  );
}