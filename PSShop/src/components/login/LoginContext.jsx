import { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationStep, setVerificationStep] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [tempLoginInfo, setTempLoginInfo] = useState(null);
  const loginUser = async (Email, Password, navigate) => {
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      console.log('Login request:', { Email });
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ Email, Password }),
      });
  
      const data = await response.json();
      console.log('Login response:', data);
  
      if (response.ok) {
        setSuccessMessage("Đăng nhập thành công!");
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (response.status === 403) {
        setErrorMessage(data.message);
        setVerificationStep(true);
        setTempEmail(Email);
        // Sửa từ userId thành UserID để match với backend
        if (data.UserID) {
          console.log('Setting userId from login:', data.UserID);
          setUserId(data.UserID);
        } else {
          console.error('UserID not found in response:', data);
        }
        // Lưu thông tin đăng nhập để dùng sau khi xác thực
        setTempLoginInfo({ Email, Password });
      } else {
        setErrorMessage(data.message || "Email hoặc mật khẩu không đúng");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };
  
  const registerUser = async (Username, Email, Password, navigate) => {
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      console.log('Register request:', { Username, Email });
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ Username, Email, Password }),
      });
  
      const data = await response.json();
      console.log('Register response:', data);
  
      if (response.status === 201) {
        setSuccessMessage(data.message);
        setVerificationStep(true);
        setTempEmail(Email);
        if (data.user?.UserID) {
          console.log('Setting userId from register:', data.user.UserID);
          setUserId(data.user.UserID);
        }
        setTempLoginInfo({ Email, Password });
      } else {
        // Xử lý lỗi validation
        if (response.status === 422 && data.errors) {
          // Lấy message đầu tiên từ mỗi trường lỗi
          const errorMessages = Object.values(data.errors)
            .map(errors => errors[0])
            .join('\n');
          setErrorMessage(errorMessages);
        } else {
          setErrorMessage(data.message || "Đăng ký thất bại");
        }
      }
    } catch (error) {
      console.error("Register error:", error);
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  const verifyEmail = async (code, userId, navigate) => {
    try {
      if (!userId) {
        console.error('UserID is null');
        setErrorMessage("Không tìm thấy thông tin người dùng");
        return;
      }
  
      if (!code || code.length !== 6) {
        setErrorMessage("Mã xác thực phải có 6 ký tự");
        return;
      }
  
      console.log('Verifying code:', { code, userId });
      
      const response = await fetch(`http://127.0.0.1:8000/api/email/verify/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          CodeId: code.toUpperCase() 
        })
      });
  
      const data = await response.json();
      console.log('Verify response:', data);
  
      if (response.ok) {
        setSuccessMessage(data.message);
        setVerificationStep(false);
        
        // Nếu có thông tin đăng nhập tạm thời, tự động đăng nhập
        if (tempLoginInfo) {
          await loginUser(tempLoginInfo.Email, tempLoginInfo.Password, navigate);
          setTempLoginInfo(null); // Xóa thông tin tạm thời
        } else {
          navigate("/login_register");
        }
      } else {
        setErrorMessage(data.message || "Xác thực thất bại");
      }
    } catch (error) {
      console.error('Verify error:', error);
      setErrorMessage("Đã xảy ra lỗi khi xác thực.");
    }
  };

  // Hàm gửi lại mã xác thực
  const resendVerificationCode = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/resend-verification-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ Email: tempEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Resend code error:", error);
      setErrorMessage("Đã xảy ra lỗi khi gửi lại mã xác thực.");
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

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };
  return (
    <LoginContext.Provider
      value={{
        user,
        isAuthenticated,
        loginUser,
        registerUser,
        verifyEmail,
        resendVerificationCode,
        logout,
        checkAuthStatus,
        errorMessage,
        successMessage,
        verificationStep,
        tempEmail,
        userId
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
