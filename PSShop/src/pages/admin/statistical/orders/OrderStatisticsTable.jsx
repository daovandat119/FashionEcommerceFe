import React, { useState, useEffect } from "react";

const OrderStatisticsTable = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fake data for demonstration
  const fakeOrderData = [
    {
      time: "2023-10-01",
      sold: 5,
      totalRevenue: 500000,
      productName: "Sản phẩm A",
      price: 100000,
      quantity: 5,
    },
    {
      time: "2023-10-02",
      sold: 3,
      totalRevenue: 300000,
      productName: "Sản phẩm B",
      price: 100000,
      quantity: 3,
    },
    {
      time: "2023-10-03",
      sold: 10,
      totalRevenue: 1000000,
      productName: "Sản phẩm C",
      price: 100000,
      quantity: 10,
    },
    {
        time: "2023-10-03",
        sold: 10,
        totalRevenue: 1000000,
        productName: "Sản phẩm C",
        price: 100000,
        quantity: 10,
      },
      {
        time: "2023-10-03",
        sold: 10,
        totalRevenue: 1000000,
        productName: "Sản phẩm C",
        price: 100000,
        quantity: 10,
      },
  ];

  const fetchOrderStatistics = async () => {
    setLoading(true);
    // Simulate an API call with fake data
    setTimeout(() => {
      setOrders(fakeOrderData);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchOrderStatistics();
  }, []);

  return (
    <div className="container mx-auto p-4 border-2 border-gray-300 rounded-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng mới nhất</h2>
      <input
        type="text"
        placeholder="Nhập mã đơn hàng"
        className="border border-gray-300 p-2 mb-4 w-[25%]"
      />

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="max-h-60 overflow-y-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border border-gray-300 p-2">Thời gian</th>
                <th className="border border-gray-300 p-2">Đơn hàng</th>
                <th className="border border-gray-300 p-2">Tổng doanh thu</th>
                <th className="border border-gray-300 p-2">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <React.Fragment key={index}>
                  <tr className="hover:bg-gray-50 text-center">
                    <td className="border border-gray-300 p-2">{order.time}</td>
                    <td className="border border-gray-300 p-2">{order.sold}</td>
                    <td className="border border-gray-300 p-2">
                      {order.totalRevenue.toLocaleString()} VNĐ
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          setExpandedOrder(expandedOrder === order ? null : order);
                        }}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order && (
                    <tr>
                      <td colSpan="4" className="border border-gray-300 p-2">
                        <table className="min-w-full border border-gray-300">
                          <thead>
                            <tr className="bg-gray-100 text-center">
                              <th className="border border-gray-300 p-2">Mã đơn hàng</th>
                              <th className="border border-gray-300 p-2">Trạng thái đơn hàng</th>
                              <th className="border border-gray-300 p-2">Tổng sản phẩm</th>
                              <th className="border border-gray-300 p-2">Tổng số lượng</th>
                              <th className="border border-gray-300 p-2">Tổng doanh thu</th>
                            
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="text-center">
                              <td className="border border-gray-300 p-2">abgdi3nsdiu3</td>
                              <td className="border border-gray-300 p-2">Đã giao hàng</td>
                              <td className="border border-gray-300 p-2">2</td>
                              <td className="border border-gray-300 p-2">3</td>
                             
                              <td className="border border-gray-300 p-2">{order.totalRevenue.toLocaleString()} VNĐ</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderStatisticsTable;