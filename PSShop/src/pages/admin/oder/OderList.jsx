import React, { useEffect, useState } from "react";
import { Card, Input, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { EyeIcon, ArrowDownIcon, TrashIcon } from "@heroicons/react/24/solid";
import { GetOrders } from "../service/api_service"; // Import hàm GetOrders
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FaSpinner } from "react-icons/fa";

const OrderList = () => {
  const [orders, setOrders] = useState([]); // State để lưu danh sách đơn hàng
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu giá trị tìm kiếm

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await GetOrders(); // Gọi hàm GetOrders
        if (response.data) {
          setOrders(response.data); // Lưu danh sách đơn hàng vào state
        } else {
          console.error("Unexpected response format:", response); // Log phản hồi không mong đợi
        }
      } catch (error) {
        console.error("Error fetching orders:", error.message || error); // Log thông điệp lỗi
      } finally {
        setLoading(false); // Đặt loading thành false sau khi hoàn thành
      }
    };

    fetchOrders(); // Gọi hàm fetchOrders
  }, []);

  // Lọc danh sách đơn hàng dựa trên giá trị tìm kiếm
  const filteredOrders = orders.filter(order =>
    order.OrderCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="text-2xl font-bold p-4">LIST ORDER</div>
      <div className="flex justify-between items-center mb-4 w-[30%] bg-white ml-3 rounded-lg">
        <Input
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          label="Search Order..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Card className="w-[98%] mx-auto p-2 shadow-lg rounded-lg">
        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
              <span className="ml-4 text-lg">Đang tải danh sách đơn hàng, vui lòng chờ...</span>
            </div>
          ) : (
            <table className="min-w-full rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-gray-700 ">
                  <th className="w-[10%] py-2 border-b border-gray-300 text-center font-medium">
                    Mã đơn hàng
                  </th>
                  <th className="w-[13%] py-2 border-b border-gray-300 text-center font-medium">
                    Trạng thái
                  </th>
                  <th className="w-[13%] py-2 border-b border-gray-300 text-center font-medium">
                    Phương thức
                  </th>
                  <th className="w-[13%] py-2 border-b border-gray-300 text-center font-medium">
                    Thanh toán
                  </th>
                  <th className="w-[6%] py-2 border-b border-gray-300 text-center font-medium">
                    Số lượng
                  </th>
                  <th className="w-[8%] py-2 border-b border-gray-300 text-center font-medium">
                    Tổng tiền
                  </th>
                  <th className="w-[6%] py-2 border-b border-gray-300 text-center font-medium">
                    Tùy chọn
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.OrderID}
                    className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 text-center"
                  >
                    <td className="p-4 border-r border-gray-300">
                      {order.OrderCode}
                    </td>
                    <td className="p-4 border-r border-gray-300">
                      {order.OrderStatus}
                    </td>
                    <td className="p-4 border-r border-gray-300">
                      {order.PaymentMethod || "Chưa có"}
                    </td>
                    <td className="p-4 border-r border-gray-300">
                      <span
                        className={
                          order.PaymentStatus === "Đã thanh toán"
                            ? "bg-green-500 text-white px-2 py-1 rounded-lg text-sm font-semibold"
                            : "bg-yellow-600 text-white px-2 py-1 rounded-lg text-sm font-semibold"
                        }
                      >
                        {order.PaymentStatus || "Chưa có"}
                      </span>
                    </td>
                    <td className="p-4 border-r border-gray-300">
                      {order.TotalQuantity || "0"}
                    </td>
                    <td className="p-4 border-r border-gray-300">
                      {order.TotalAmount || "0.00"}
                    </td>
                    <td className="p-4 flex gap-2 justify-center">
                      <Link
                        to={`edit/${order.OrderID}`}
                        className="p-2 rounded-full shadow-md bg-blue-200 text-blue-500"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <Button
                        size="sm"
                        color="purple"
                        className="p-2 bg-purple-400 rounded-full shadow-md"
                      >
                        <ArrowDownIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        size="sm"
                        color="red"
                        className="p-2 rounded-full shadow-md"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </>
  );
};

export default OrderList;
