import React, { createContext, useState } from "react";
import axios from "axios";

// Tạo context
export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State lưu thông tin người dùng
  const [error, setError] = useState(null); // State lưu lỗi nếu có
  const [success, setSuccess] = useState(null); // State lưu thông báo thành công

  // Hàm đăng nhập
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        Email: email,
        Password: password,
      });
      setUser(response.data.user); // Lưu thông tin người dùng
      setError(null); // Xóa lỗi nếu thành công
      setSuccess("Login successful!");
    } catch (error) {
      // Xử lý lỗi chi tiết từ server
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (errors.Email) {
          setError(errors.Email[0]);
        } else if (errors.Password) {
          setError(errors.Password[0]);
        } else {
          setError("Login failed. Please check your credentials.");
        }
      } else {
        setError(error.response?.data?.message || "Login failed.");
      }
    }
  };

  // Hàm đăng ký
  const register = async (username, email, password) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        Username: username,
        Email: email,
        Password: password,
      });
      setUser(response.data.user);
      setError(null);
      setSuccess("Registration successful! Redirecting to login page...");
    } catch (error) {
      // Xử lý lỗi chi tiết từ server
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (errors.Email) {
          setError(errors.Email[0]); // Email đã được sử dụng
        } else if (errors.Password) {
          setError(errors.Password[0]); // Mật khẩu không đủ mạnh
        } else if (errors.Username) {
          setError(errors.Username[0]); // Tên người dùng có thể không hợp lệ
        } else {
          setError("Registration failed. Please check your information.");
        }
      } else {
        setError(error.response?.data?.message || "Registration failed.");
      }
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null); // Xóa thông tin người dùng
  };

  return (
    <LoginContext.Provider value={{ user, login, register, logout, error, success }}>
      {children}
    </LoginContext.Provider>
  );
};
