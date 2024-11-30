/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export const LoginContext = createContext();

const isValidEmail = (email) => email.includes("@") && email.includes(".");
const isValidPassword = (password) => password.length >= 6;
const isValidUsername = (username) => /^[a-zA-Z0-9_]{3,}$/.test(username);
const isValidVerificationCode = (code) => /^[A-Z0-9]{6}$/.test(code);

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
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ Email, Password }),
      });

      const data = await response.json();

      if (response.ok) {
        const roleId = data.user.RoleID;
        if (roleId == 1) {
          setErrorMessage("Tài khoản này không thể đăng nhập. Vui lòng thử lại.");
          return;
        }
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem("token", data.token);
        
        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setErrorMessage(data.message || "Email hoặc mật khẩu không đúng");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  const registerUser = async (Username, Email, Password) => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!isValidUsername(Username)) {
      setErrorMessage(
        "Username phải có ít nhất 3 ký tự và chỉ chứa chữ cái, số hoặc dấu gạch dưới."
      );
      return;
    }
    if (!isValidEmail(Email)) {
      setErrorMessage("Email không hợp lệ.");
      return;
    }
    if (!isValidPassword(Password)) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ Username, Email, Password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccessMessage(data.message);
        setVerificationStep(true);
        setTempEmail(Email);
        if (data.user?.UserID) {
          setUserId(data.user.UserID);
        }
        setTempLoginInfo({ Email, Password });
      } else {
        if (response.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors)
            .map((errors) => errors[0])
            .join("\n");
          setErrorMessage(errorMessages);
        } else {
          setErrorMessage(data.message || "Đăng ký thất bại");
        }
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  const verifyEmail = async (code, userId, navigate) => {
    const storedUserId = userId || localStorage.getItem("tempUserId");
    if (!storedUserId) {
      setErrorMessage("Không tìm thấy thông tin người dùng");
      return;
    }

    if (!isValidVerificationCode(code)) {
      setErrorMessage("Mã xác thực phải là 6 ký tự chữ hoa hoặc số.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/email/verify/${storedUserId}?CodeId=${code.toUpperCase()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setVerificationStep(false);
        localStorage.removeItem("tempUserId"); // Xóa UserID tạm sau khi xác thực thành công

        if (tempLoginInfo) {
          await loginUser(
            tempLoginInfo.Email,
            tempLoginInfo.Password,
            navigate
          );
          setTempLoginInfo(null); // Xóa thông tin đăng nhập tạm
        } else {
          navigate("/login_register");
        }
      } else {
        setErrorMessage(data.message || "Xác thực thất bại");
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi khi xác thực.");
    }
  };
  const resendVerificationCode = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/resend-verification-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ Email: tempEmail }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi khi gửi lại mã xác thực.");
    }
  };

  const logout = () => {
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
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ Email: email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu.");
    }
  };

  const googleLogin = async () => {
    // Thực hiện logic đăng nhập bằng Google ở đây
    // Có thể sử dụng Firebase hoặc một thư viện khác để xử lý đăng nhập bằng Google
  };

  return (
    <LoginContext.Provider
      value={{
        user,
        googleLogin,
        forgotPassword,
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
        userId,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

LoginProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
