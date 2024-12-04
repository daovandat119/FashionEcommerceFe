import React, { useCallback, useEffect, useState } from "react";
import { Card, Input, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { EyeIcon, ArrowDownIcon, TrashIcon } from "@heroicons/react/24/solid";
import { GetOrders } from "../service/api_service";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FaSpinner } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useDebounce } from "use-debounce";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearchValue] = useDebounce(searchTerm, 500);

  const fetchOrders = useCallback(async (page, statusFilter, searchTerm) => {
    try {
      const response = await GetOrders(page, statusFilter, searchTerm);
      if (response.data) {
        setOrders(response.data);
        setPage(response.page);
        setTotalPages(response.totalPage);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message || error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    setSearchTerm(searchTerm);
  }, []);

  useEffect(() => {
    handleSearch(debouncedSearchValue);
  }, [debouncedSearchValue]);

  useEffect(() => {
    fetchOrders(page, statusFilter, debouncedSearchValue);
  }, [page, statusFilter, debouncedSearchValue, fetchOrders]);

  const handlePageChange = useCallback(
    (event) => {
      const newPageNumber = event.selected + 1;
      setPage(newPageNumber);
      fetchOrders(newPageNumber);
    },
    [fetchOrders]
  );

  return (
    <>
      <div className="text-2xl font-bold p-4">Quản lý đơn hàng</div>
      <div className="flex  items-center mb-4 ">
        <div className="flex justify-between items-center w-[30%] bg-white ml-3 rounded-lg">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="ml-2 p-2 border rounded-lg"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="1">Đang xử lý</option>
          <option value="2">Đang giao hàng</option>
          <option value="3">Đã giao</option>
          <option value="4">Đã hủy</option>
        </select>
      </div>
      <Card className="w-[98%] mx-auto p-2 shadow-lg rounded-lg">
        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
              <span className="ml-4 text-lg">
                Đang tải danh sách đơn hàng, vui lòng chờ...
              </span>
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
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      Không có đơn hàng nào.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
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
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && (
          <ReactPaginate
            breakLabel="..."
            nextLabel=" >"
            onPageChange={handlePageChange}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            previousLabel="<"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination flex justify-center space-x-2 mt-4"
            activeClassName="active bg-blue-500 text-white"
            forcePage={page - 1}
          />
        )}
      </Card>
    </>
  );
};

export default OrderList;
