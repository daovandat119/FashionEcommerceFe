import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../../../public/assets/images/logo.png";
import { LoginAdmin, fetchAdminDetails } from "../service/api_service";
import { useAuth } from "../../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loi, setLoi] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    let tempErrors = {};
    if (!Email) {
      tempErrors.Email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      tempErrors.Email = "Email không hợp lệ";
    }
    if (!Password) {
      tempErrors.Password = "Mật khẩu không được để trống";
    } else if (Password.length < 6) {
      tempErrors.Password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleClickBtn = async (e) => {
    e.preventDefault();
    setLoi("");

    if (validateForm()) {
      try {
        const res = await LoginAdmin(Email, Password);

        if (res && res.token) {
          login(res.token);

          // Hiển thị thông báo thành công
          Swal.fire({
            icon: "success",
            title: "Đăng nhập thành công!",
            confirmButtonText: "Đồng ý",
          }).then(() => {
            // Chuyển hướng đến dashboard
            navigate("/admin/dashboard");
          });
        } else {
          const errorMessage =
            res.message || "Tài khoản hoặc mật khẩu không chính xác";
          setLoi(errorMessage);

          // Hiển thị thông báo lỗi
          Swal.fire({
            icon: "error",
            title: "Đăng nhập thất bại",
            text: errorMessage,
            confirmButtonText: "Đồng ý",
          });
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.";
        setLoi(errorMessage);

        // Hiển thị thông báo lỗi từ API hoặc lỗi mặc định
        Swal.fire({
          icon: "error",
          title: "Đã xảy ra lỗi",
          text: errorMessage,
          confirmButtonText: "Đồng ý",
        });

        console.error("Lỗi đăng nhập:", err);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gradient-to-t from-slate-300 via-slate-200 to-slate-100 w-full h-[100vh] flex items-center">
      <ToastContainer />
      <div className="w-[30%] mx-auto bg-white py-3 rounded-lg shadow-2xl">
        <img className="w-[1/4] mx-auto pt-5" src={logo} alt="Logo" />
        <div className="text-2xl font-semibold text-center py-3">
          ĐĂNG NHẬP QUẢN TRỊ
        </div>
        <form
          onSubmit={handleClickBtn}
          className="flex flex-col justify-start items-start gap-4 p-3"
        >
          <div className="relative flex flex-col w-full">
            <div className="relative flex items-center w-full border-b-2">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-3 text-gray-400"
              />
              <input
                value={Email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errors.Email) setErrors({ ...errors, Email: "" });
                }}
                className="outline-none w-full py-2 pl-10 text-lg"
                placeholder="Địa chỉ Email *"
                type="email"
                id="email"
                autoComplete="username"
              />
            </div>
            {errors.Email && (
              <span className="text-red-500 text-sm mt-1">{errors.Email}</span>
            )}
          </div>
          <div className="relative flex flex-col w-full">
            <div className="relative flex items-center w-full border-b-2">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 text-gray-400"
              />
              <input
                value={Password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errors.Password) setErrors({ ...errors, Password: "" });
                }}
                className="outline-none w-full py-2 pl-10 text-lg"
                placeholder="Mật khẩu *"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="absolute right-3 cursor-pointer text-gray-400"
                onClick={togglePasswordVisibility}
              />
            </div>
            {errors.Password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.Password}
              </span>
            )}
          </div>

          {loi && (
            <div className="text-red-500 text-sm w-full text-center">{loi}</div>
          )}

          <button
            type="submit"
            className="bg-slate-600 mt-3 hover:from-slate-300 w-2/5 py-3 mx-auto text-center rounded-full
            active:opacity-40 transition-all duration-300 text-white font-semibold"
          >
            Đăng nhập
          </button>
          <Link className="text-black opacity-50 hover:opacity-90 text-center w-full font-medium mt-14">
            Quên mật khẩu ?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
