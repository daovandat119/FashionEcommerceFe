import React, { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";

const OrderStatisticsTable = ({
  data,
  onPageChange,
  onSearch,
  onEditOrder,
}) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  useEffect(() => {
    if (data && data.statisticsOrder && data.statisticsOrder.data) {
      const updatedOrders = data.statisticsOrder.data.map((order) => ({
        OrderID: order.OrderID,
        OrderCode: order.OrderCode,
        OrderStatusName: order.OrderStatusName,
        created_at: order.created_at,
        Amount: order.Amount,
        PaymentMethodName: order.PaymentMethodName,
        PaymentStatusName: order.PaymentStatusName,
        Quantity: order.Quantity,
      }));
      setOrders(updatedOrders);
      setLoading(false);
      setTotalPage(data.statisticsOrder.totalPage);
      setCurrentPage(data.statisticsOrder.page);
    } else {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    handleSearch(debouncedSearchValue);
  }, [debouncedSearchValue]);

  const handlePageClick = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      onPageChange(newPage);
    },
    [onPageChange]
  );

  const handleSearch = useCallback(
    (searchValue) => {
      onSearch(searchValue);
    },
    [onSearch]
  );

  const handleEditOrder = (orderID) => {
    navigate(`/admin/orders/edit/${orderID}`, {
      state: { from: "statistics" },
    });
  };

  return (
    <div className="container mx-auto p-4 border-2 border-gray-300 rounded-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Các đơn hàng</h2>
      <input
        type="text"
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        placeholder="Nhập mã đơn hàng"
        className="border border-gray-300 p-2 mb-4 w-[25%]"
      />

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="h-[360px] overflow-y-auto relative">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border border-gray-300 p-2 w-[1%]">
                  Mã đơn hàng
                </th>
                <th className="border border-gray-300 p-2">Trạng thái</th>
                <th className="border border-gray-300 p-2">
                  Phương thức thanh toán
                </th>
                <th className="border border-gray-300 p-2">Tổng số lượng</th>
                <th className="border border-gray-300 p-2">Tổng doanh thu</th>
                <th className="border border-gray-300 p-2">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <React.Fragment key={index}>
                  <tr className="hover:bg-gray-50 text-center">
                    <td className="border border-gray-300 p-2 w-[1%] overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                      {order.OrderCode}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {order.OrderStatusName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {order.PaymentMethodName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {order.Quantity}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {Math.floor(order.Amount.toLocaleString())} VND
                    </td>
                    <td className="border border-gray-300 p-2">
                      {order.created_at}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {totalPage > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-white">
              <ReactPaginate
                breakLabel="..."
                nextLabel=" >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={totalPage}
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
                forcePage={currentPage - 1}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderStatisticsTable;
