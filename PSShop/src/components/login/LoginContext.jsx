import { createContext, useState } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Hàm xử lý đăng ký và tự động đăng nhập
  const registerUser = async (Username, Email, Password, navigate) => {
    setErrorMessage("");
    setSuccessMessage("");

    if (Password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

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
        setSuccessMessage("Registration successful! Logging in...");

        // Gọi hàm loginUser sau khi đăng ký thành công
        loginUser(Email, Password, navigate);
      } else {
        setErrorMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  // Hàm xử lý đăng nhập
  const loginUser = async (Email, Password, navigate) => {
    setErrorMessage("");
    setSuccessMessage("");

    if (Password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

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
        setSuccessMessage("Login successful! Redirecting...");
        setUser(data.user); // Lưu thông tin user sau khi đăng nhập
        
        // Lưu token vào localStorage hoặc sessionStorage
        localStorage.setItem("token", data.token);

        // Điều hướng đến trang chủ
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setErrorMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <LoginContext.Provider
        value={{
            user,
            loginUser,
            registerUser,
            errorMessage,
            successMessage,
        }}
    >
        {children}
    </LoginContext.Provider>
  );
};
