import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { Link, useParams } from 'react-router-dom'; // Import Link và useParams từ react-router-dom
import { GetUserById, UpdateUserStatus, RestoreUser } from '../service/api_service'; // Import hàm RestoreUser

const UpdateUser = () => {
  const { id } = useParams(); // Lấy UserID từ URL
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
    e.preventDefault();
    try {
      if (userData.isActive) {
        // Gọi API RestoreUser nếu trạng thái là Active
        await RestoreUser(id);
        console.log("User restored successfully");
      } else {
        // Gọi API BlockedUser nếu trạng thái là Blocked
        await UpdateUserStatus(id, { isActive: 0 }); // Giả sử 0 là trạng thái Blocked
        console.log("User blocked successfully");
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <div className="flex">
      <div className="w-[50%] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Update User</h1>
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
              <label className="block mb-1">Image:</label>
              <span className="border border-gray-300 bg-slate-200 rounded-md p-2 w-full block">
                {userData.image || "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <label className="mr-2">Is Active:</label>
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
              <label className="block ">ROLE:</label>
              <span className="border-gray-300 rounded-md text-xl font-medium block">
                {userData.role || "N/A"}
              </span>
            </div>
            <div className="flex justify-between mt-4">
              <Link to="/admin/users" className="flex items-center font-medium bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600">
                Back to User List
              </Link>
              <Button type="submit" color="green">
                Update User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
