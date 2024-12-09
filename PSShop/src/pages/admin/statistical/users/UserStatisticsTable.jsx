import React, { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
import { useDebounce } from "use-debounce";

const UserStatisticsTable = ({ data, onPageChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchValue] = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (data && data.queryUser && data.queryUser.data) {
      setUsers(data.queryUser.data);
      setTotalPages(data.queryUser.totalPage);
      setCurrentPage(data.queryUser.page);
    }
  }, [data]);

  const handlePageClick = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      onPageChange(newPage);
    },
    [onPageChange]
  );

  const handleSearch = useCallback((searchValue) => {
    onSearch(searchValue);
  }, []);

  useEffect(() => {
    handleSearch(debouncedSearchValue);
  }, [debouncedSearchValue]);

  return (
    <div className="container mx-auto p-4 border-2 border-gray-300 rounded-lg bg-white h-[500px]">
      <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Nhập tên người dùng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-auto h-[250px]">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Tên người dùng</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, itemsPerPage).map((user, index) => (
                <tr key={index} className="hover:bg-gray-50 text-center">
                  <td className="border border-gray-300 p-2">{user.UserID}</td>
                  <td className="border border-gray-300 p-2">
                    {user.Username}
                  </td>
                  <td className="border border-gray-300 p-2">{user.Email}</td>
                  <td className="border border-gray-300 p-2">
                    {user.IsActive ? "Đang hoạt động" : "Đã khóa"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel=" >"
          onPageChange={handlePageClick}
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
          forcePage={currentPage - 1}
        />
      )}
    </div>
  );
};

export default UserStatisticsTable;
