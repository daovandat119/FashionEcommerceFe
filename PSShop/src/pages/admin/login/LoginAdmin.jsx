import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../../public/assets/images/logo.png";
import { LoginAdmin } from "../service/api_service";
import { useAuth } from '../../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          
          toast.success("Đăng nhập thành công!");
          navigate("/admin/dashboard");
        } else {
          setLoi(res.message || "Tài khoản hoặc mật khẩu không chính xác");
          toast.error(res.message || "Tài khoản hoặc mật khẩu không chính xác");
        }
      } catch (err) {
        setLoi(err.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
        toast.error(err.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
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
          LOGIN ADMIN
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
                placeholder="Email"
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
                placeholder="Password"
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

          <div className="flex items-center gap-2 pl-3">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>

          {loi && (
            <div className="text-red-500 text-sm w-full text-center">{loi}</div>
          )}

          <button
            type="submit"
            className="bg-slate-600 mt-3 hover:from-slate-300 w-2/5 py-3 mx-auto text-center rounded-full
            active:opacity-40 transition-all duration-300 text-white font-semibold"
          >
            LOGIN
          </button>
          <Link
            to="/forgot-password"
            className="text-black opacity-50 hover:opacity-90 text-center w-full font-medium mt-14"
          >
            Forgot password ?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
