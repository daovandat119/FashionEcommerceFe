import { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const registerUser = async (Username, Email, Password, navigate) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Username, Email, Password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Đăng ký thành công!");
        // Tự động đăng nhập sau khi đăng ký
        loginUser(Email, Password, navigate);
      } else {
        toast.error(data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  };

  const loginUser = async (Email, Password, navigate) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email, Password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        toast.error(data.message || "Email hoặc mật khẩu không đúng");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Đã đăng xuất");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <LoginContext.Provider
      value={{
        user,
        isAuthenticated,
        loginUser,
        registerUser,
        logout
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
