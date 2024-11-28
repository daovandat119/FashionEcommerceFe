// src/components/UserProfileDisplay.js

import React from "react";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa"; // Import icon cho mật khẩu và user

const MyAdminProfile = () => {
  const user = {
    userName: "Hai1",
    phone: "0964445201",
    email: "adminhai@gmail.com",
    password: "123456",
  };

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  return (
    <div>
      <div className="flex justify-center mb-4 py-3">
        <FaUserCircle className="text-6xl text-gray-500" /> {/* Icon user */}
      </div>
      <h2 className="text-2xl font-bold text-center mb-4">Thông tin Admin</h2>

      <div className="flex flex-col gap-4">
        <div>
          <p>Username:</p>
          <input
            className="border-2 border-gray-300 rounded-md w-full p-2"
            type="text"
            value={user.userName}
            readOnly
          />
        </div>

        <div>
          <p>Email:</p>
          <input
            className="border-2 border-gray-300 rounded-md w-full p-2"
            type="text"
            value={user.email}
            readOnly
          />
        </div>

        <div className="profile-field">
          <p>Mật khẩu:</p>
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={user.password}
              readOnly
              className="input-field pr-10 border-2 border-gray-300 w-full rounded-md p-2"
            />
            <span
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-2 bottom-1 transform -translate-y-1/2 cursor-pointer"
            >
              {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-500 text-white p-3 my-3 rounded-xl">Chỉnh sửa</button>
        </div>
      </div>
    </div>
  );
};

export default MyAdminProfile;
