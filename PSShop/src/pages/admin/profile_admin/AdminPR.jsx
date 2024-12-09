// src/components/UserProfileDisplay.js
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect, useState } from "react";
import { FaUserCircle, FaPencilAlt } from "react-icons/fa"; // Import icon cho mật khẩu và user
import {
  ChangePassword,
  fetchAccountDetails,
  updateUserProfile,
} from "../service/api_service"; // Đường dẫn đến hàm fetchAccountDetails
import axios from "axios";
import Swal from 'sweetalert2';

const MyAdminProfile = () => {
  const [user, setUser] = useState(null); // Khởi tạo state cho user
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newImage, setNewImage] = useState(null); // State for the new image
  const [isEditingUsername, setIsEditingUsername] = useState(false); // State to track editing mode

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const accountData = await fetchAccountDetails(); // Fetch account details
        setUser(accountData); // Set user data
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    getUserDetails();
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    await ChangePassword(oldPassword, newPassword, confirmPassword);
    alert("Mật khẩu đã được thay đổi thành công!");
    setShowChangePassword(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImage(file); // Set the new image file
      console.log("Image uploaded:", file);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("name", newUsername);
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      console.log(formData);
      const response = await updateUserProfile(formData);
      if (response) {
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công',
          text: response.message,
          showConfirmButton: true
        });
      }
      setIsEditingUsername(false);
      // Optionally, refresh user data here
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Có lỗi khi cập nhật thông tin',
        text: error.message || 'Vui lòng thử lại sau!',
        showConfirmButton: true
      });
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-4 py-3">
        {user.image ? (
          <div className="relative">
            <img
              src={user.image}
              alt="Avatar"
              className="w-24 h-24 rounded-full"
            />
            <label
              htmlFor="file-upload"
              className="absolute bottom-0 right-0 cursor-pointer"
            >
              <FaPencilAlt className="text-gray-500" />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
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
            value={isEditingUsername ? newUsername : user.username} // Use newUsername if editing
            onChange={(e) => setNewUsername(e.target.value)}
            readOnly={!isEditingUsername} // Make it editable only when in editing mode
            onClick={() => {
              if (!isEditingUsername) {
                setNewUsername(user.username); // Set current username for editing
                setIsEditingUsername(true); // Enable editing mode
              }
            }}
          />
        </div>

        <div>
          <p>Email:</p>
          <input
            className="border-2 border-gray-300 rounded-md w-full p-2 bg-gray-200"
            type="text"
            value={user.email} // Adjusted to match the API response
            readOnly
          />
        </div>

        <div>
          <p>Image:</p>
          <input
            className="border-2 border-gray-300 rounded-md w-full p-2 bg-gray-200"
            type="file"
            onChange={handleImageUpload} // Handle image upload
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              if (isEditingUsername) {
                // Check if the username or image has changed
                if (newUsername !== user.username || newImage !== user.image) {
                  handleUpdateProfile(); // Call API only if changes are detected
                } else {
                  // Optionally, you can show a message indicating no changes were made
                  alert("Không có thay đổi nào để cập nhật."); // "No changes to update."
                }
              } else {
                setNewUsername(user.username); // Set current username for editing
                setIsEditingUsername(true); // Enable editing mode
              }
            }}
            className={
              isEditingUsername
                ? "bg-green-500 text-white p-3 my-3 rounded-xl"
                : "bg-green-600 text-white p-3 my-3 rounded-xl"
            }
          >
            Thay đổi thông tin
          </button>
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
          <div className="bg-white w-[30%]  p-6 rounded-lg ">
            <h2 className="text-xl font-bold mb-4">Đổi mật khẩu</h2>
            <div>
              <label className="block mb-2">Mật khẩu cũ:</label>
              <input
                type="password"
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="border-2 border-gray-300 rounded-md w-full p-2"
              />
            </div>
            <div>
              <label className="block mb-2">Mật khẩu mới:</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-2 border-gray-300 rounded-md w-full p-2"
              />
            </div>
            <div>
              <label className="block mb-2">Xác nhận mật khẩu:</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
