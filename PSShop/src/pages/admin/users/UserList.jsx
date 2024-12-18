import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { ListUsers, BlockedUser } from "../service/api_service"; // Import hàm ListUsers, BlockedUser
import { ToastContainer } from "react-toastify"; // Import toast
import { FaSpinner } from "react-icons/fa"; // Import spinner icon
import { useDebounce } from "use-debounce";
import ReactPaginate from "react-paginate";
import Swal from 'sweetalert2'; // Import SweetAlert

const UserList = () => {
  const [Users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null);
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const [page, setPage] = useState("");
  const [totalPages, setTotalPages] = useState("");

  useEffect(() => {
    fetchUsers(page, debouncedSearchValue);
  }, [debouncedSearchValue]);

  const fetchUsers = async (page, debouncedSearchValue) => {
    setIsLoading(true);
    try {
      const response = await ListUsers(page, debouncedSearchValue);
      setUsers(response.data);
      setPage(response.page);
      setTotalPages(response.totalPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      setPage(newPage);
      fetchUsers(newPage);
    },
    [fetchUsers]
  );

 

  const getStatusLabel = (user) => {
    return user.IsActive
      ? { label: "Active", color: "bg-green-500" }
      : { label: "Blocked", color: "bg-red-500" };
  };

  const getRoleName = (roleID) => {
    switch (roleID) {
      case 1:
        return "Admin";
      case 2:
        return "User";
      default:
        return "Unknown";
    }
  };

  const handleBlockUser = async (userID) => {
    if (window.confirm("Bạn có chắc chắn muốn chặn người dùng này không?")) {
      try {
        const response = await BlockedUser(userID); // Gọi API để chặn người dùng
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.UserID === userID ? { ...user, IsActive: false } : user
          )
        );
        Swal.fire("Thành công!", response.message || "Người dùng đã bị chặn thành công!", "success"); // Hiển thị thông báo từ API
      } catch (err) {
        setError(err.message); // Xử lý lỗi
        Swal.fire("Lỗi!", err.message || "Có lỗi xảy ra khi chặn người dùng.", "error"); // Hiển thị thông báo lỗi
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative ">
      <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            type="text"
            value={searchValue}
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Tìm kiếm người dùng"
            onChange={(e) => setSearchValue(e.target.value)}
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
          />
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow ">
        {isLoading ? ( // Hiển thị loading
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
            <span className="ml-4 text-lg">Đang tải người dùng...</span>
          </div>
        ) : (
          <table className="w-full min-w-max border-collapse ">
            <thead className="hover:bg-gray-50 ">
              <tr>
                <th className="border-b p-4 text-left">STT</th>
                <th className="border-b p-4 text-left">Name</th>
                <th className="border-b p-4 text-left">Email</th>
                <th className="border-b p-4 text-left">Chức vụ</th>
                <th className="border-b p-4 text-left">Trạng thái</th>
                <th className="border-b p-4 text-left">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {Users.map((user, index) => {
                const { label, color } = getStatusLabel(user);
                return (
                  <tr key={user.UserID} className="hover:bg-gray-50">
                    <td className="border-b p-4">{index + 1}</td>
                    <td className="border-b p-4">{user.Username}</td>
                    <td className="border-b p-4">{user.Email}</td>
                    <td className="border-b p-4">{getRoleName(user.RoleID)}</td>
                    <td className="border-b p-4 flex items-center py-5">
                      <span className={`h-2 w-2 rounded-full ${color} mr-2`} />
                      {label}
                    </td>
                    <td className="border-b p-4">
                      <Link
                        to={`/admin/users/edit-users/${user.UserID}`} // Truyền UserID vào URL
                        className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleBlockUser(user.UserID)} // Gọi hàm chặn người dùng
                        className="bg-red-600 text-white p-2 rounded-full mr-2 hover:bg-red-500 transition-colors inline-flex items-center justify-center"
                      >
                        <LockClosedIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
       <div className="flex justify-center"> 
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
       </div>
      )}
    </div>
  );
};

export default UserList;
