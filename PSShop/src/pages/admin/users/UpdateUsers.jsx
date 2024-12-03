import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { GetUserById, UpdateUserStatus, BlockedUser } from '../service/api_service'; // Import hàm BlockedUser
import { toast } from 'react-toastify';

const UpdateUser = () => {
  const { id } = useParams(); // Lấy UserID từ URL
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    image: "",
    isActive: false,
    role: "",
  });

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await GetUserById(id); 
        const user = response; 
        if (user) {
          setUserData({
            username: user.Username || "",
            email: user.Email || "",
            image: user.Image || "",
            isActive: user.IsActive === 1, // Chuyển đổi từ số sang boolean
            role: user.RoleID === 1 ? "Admin" : user.RoleID === 2 ? "User" : "Moderator",
          });
        } else {
          console.error("User not found");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetail();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    try {
      let response;
      if (userData.isActive) {
        // Gọi API UpdateUserStatus nếu trạng thái là Active
        response = await UpdateUserStatus(id); // Gọi API để cập nhật trạng thái người dùng
      } else {
        // Gọi API BlockedUser nếu trạng thái là Blocked
        response = await BlockedUser(id); // Gọi API để chặn người dùng
      }
      // Hiển thị thông báo từ API
      navigate("/admin/users", { state: { success: true, message: response.message || "Cập nhật trạng thái người dùng thành công!" } }); // Điều hướng về danh sách người dùng
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(err.message || "Error updating user"); // Hiển thị thông báo lỗi
    }
  };

  return (
    <div className="flex">
      <div className="w-[50%] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Chi tiết người dùng</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1">Username:</label>
              <span className="border border-gray-300 rounded-md p-2 bg-slate-200 w-full block">
                {userData.username || "N/A"}
              </span>
            </div>
            <div>
              <label className="block mb-1">Email:</label>
              <span className="border border-gray-300 bg-slate-200 rounded-md p-2 w-full block">
                {userData.email || "N/A"}
              </span>
            </div>
            <div>
              <label className="block mb-1">Ảnh đại diện:</label>
              <span className="border border-gray-300 bg-slate-200 rounded-md p-2 w-full block">
                {userData.image || "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <label className="mr-2">Trạng thái:</label>
              <select
                name="isActive"
                value={userData.isActive ? "ACTIVE" : "BLOCKED"}
                onChange={(e) => setUserData((prev) => ({ ...prev, isActive: e.target.value === "ACTIVE" }))}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <label className="block ">Chức vụ :</label>
              <span className="border-gray-300 rounded-md text-xl font-medium block">
                {userData.role || "N/A"}
              </span>
            </div>
            <div className="flex justify-between mt-4">
              <Link to="/admin/users" className="flex items-center font-medium bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600">
                Quay lại người dùng
              </Link>
              <Button type="submit" color="green">
                Cập nhật người dùng
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
