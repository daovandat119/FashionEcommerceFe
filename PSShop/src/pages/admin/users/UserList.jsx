import React, { useEffect, useState } from "react";
import { Input } from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { ListUsers, BlockedUser } from "../service/api_service"; // Import hàm ListUsers, BlockedUser
import { toast, ToastContainer } from "react-toastify"; // Import toast
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

const UserList = () => {
  const [Users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null);
  const location = useLocation(); // Lấy location để kiểm tra trạng thái

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true); // Bắt đầu loading
      try {
        const response = await ListUsers(1); // Lấy trang đầu tiên
        setUsers(response.data); // Giả sử response.data chứa danh sách người dùng
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (location.state?.success) {
      toast.success(location.state.message || "Thao tác thành công!", {
        autoClose: 3000,
      });
    }
  }, [location.state]);

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
        setUsers(
          Users.map((user) =>
            user.UserID === userID ? { ...user, IsActive: false } : user
          )
        ); // Cập nhật trạng thái người dùng trong state
        toast.success(response.message || "Người dùng đã bị chặn thành công!"); // Hiển thị thông báo từ API
      } catch (err) {
        setError(err.message); // Xử lý lỗi
        toast.error(err.message || "Có lỗi xảy ra khi chặn người dùng."); // Hiển thị thông báo lỗi
      }
    }
  };

  const handleBlockedUser = async (userID) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        const response = await BlockedUser(userID); // Gọi API để xóa người dùng
        setUsers(Users.filter((user) => user.UserID !== userID)); // Cập nhật danh sách người dùng trong state
        toast.success(response.message || "Người dùng đã bị xóa thành công!"); // Hiển thị thông báo từ API
      } catch (err) {
        setError(err.message); // Xử lý lỗi
        toast.error(err.message || "Có lỗi xảy ra khi xóa người dùng."); // Hiển thị thông báo lỗi
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search users"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
          />
        </div>
        <Link
          to="/admin/users/add"
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5" /> New User
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {isLoading ? ( // Hiển thị loading
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
            <span className="ml-4 text-lg">Đang tải người dùng...</span>
          </div>
        ) : (
          <table className="w-full min-w-max border-collapse">
            <thead className="hover:bg-gray-50 ">
              <tr>
                <th className="border-b p-4 text-left">STT</th>
                <th className="border-b p-4 text-left">Name</th>
                <th className="border-b p-4 text-left">Email</th>
                <th className="border-b p-4 text-left">Role</th>
                <th className="border-b p-4 text-left">Status</th>
                <th className="border-b p-4 text-left">Actions</th>
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
    </div>
  );
};

export default UserList;
