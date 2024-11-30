// src/components/UserProfileDisplay.js

import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // Import icon cho mật khẩu và user
import { fetchAccountDetails } from "../service/api_service"; // Đường dẫn đến hàm fetchAccountDetails

const MyAdminProfile = () => {
  const [user, setUser] = useState(null); // Khởi tạo state cho user
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const accountData = await fetchAccountDetails(); // Fetch account details
        setUser(accountData); // Set user data
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    getUserDetails(); // Call the function when the component mounts
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    // Call API to change password here
    // Example: await changePasswordAPI(oldPassword, newPassword);
    alert("Mật khẩu đã được thay đổi thành công!");
    setShowChangePassword(false);
  };

  useEffect(() => {
    const updatePassword = async () => {
      await changePassword(oldPassword, newPassword);
    };
    updatePassword();
  }, [oldPassword, newPassword, confirmPassword]);

  if (!user) {
    return <p>Loading...</p>; // Show loading while fetching data
  }

  const handleUpdateProfile = async (e) => {
    const { name, value } = e.target;
    if (name === "oldPassword") {
      setOldPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-4 py-3">
        {user.image ? (
          <img
            src={user.image}
            alt="Avatar"
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <FaUserCircle className="text-6xl text-gray-500" />
        )}
      </div>
      <h2 className="text-2xl font-bold text-center mb-4">Thông tin Admin</h2>

      <div className="flex flex-col gap-4">
        <div>
          <p>Username:</p>
          <input
            className="border-2 border-gray-300 rounded-md w-full p-2"
            type="text"
            value={user.username} // Adjusted to match the API response
            readOnly
          />
        </div>

        <div>
          <p>Email:</p>
          <input
            className="border-2 border-gray-300 rounded-md w-full p-2"
            type="text"
            value={user.email} // Adjusted to match the API response
            readOnly
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowChangePassword(true)}
            className="bg-blue-500 text-white p-3 my-3 rounded-xl"
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>

      {/* Popup for changing password */}
      {showChangePassword && (
        <div className="fixed inset-0 flex  items-center justify-center backdrop-blur-sm bg-opacity-50">
          <div className="bg-white w-[30%]  p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Đổi mật khẩu</h2>
            <div>
              <label className="block mb-2">Mật khẩu cũ:</label>
              <input
                type="password"
                name="oldPassword"
                value={oldPassword}
                onChange={handleUpdateProfile}
                className="border-2 border-gray-300 rounded-md w-full p-2"
              />
            </div>
            <div>
              <label className="block mb-2">Mật khẩu mới:</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={handleUpdateProfile}
                className="border-2 border-gray-300 rounded-md w-full p-2"
              />
            </div>
            <div>
              <label className="block mb-2">Xác nhận mật khẩu:</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleUpdateProfile}
                className="border-2 border-gray-300 rounded-md w-full p-2"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleChangePassword}
                className="bg-blue-500 text-white p-2 rounded-md mr-2"
              >
                Lưu
              </button>
              <button
                onClick={() => setShowChangePassword(false)}
                className="bg-gray-300 text-black p-2 rounded-md"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAdminProfile;
