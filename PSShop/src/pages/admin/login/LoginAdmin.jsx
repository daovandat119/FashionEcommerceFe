import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../../public/assets/images/logo.png";
import { LoginAdmin } from "../service/api_service";
import { useAuth } from '../../../context/AuthContext';

const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loi, setLoi] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated, cleanupStorage } = useAuth();

  useEffect(() => {
    cleanupStorage(); // Cleanup storage when component mounts
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate, cleanupStorage]);

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
        console.log(res);
        if (res && res.token) {
          login(res.token, res.user);
          navigate("/admin/dashboard");
        } else {
          setLoi("Tài khoản hoặc mật khẩu không chính xác");
        }
      } catch (err) {
        setLoi("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
        console.error("Lỗi đăng nhập:", err);
      }
    }
  };

  return (
    <div className="bg-gradient-to-t from-slate-300 via-slate-200 to-slate-100 w-full h-[100vh] flex items-center">
      <div className="w-[30%] mx-auto bg-white py-3 rounded-lg shadow-2xl">
        <img className="w-[1/4] mx-auto pt-5" src={logo} alt="Logo" />
        <div className="text-2xl font-semibold text-center py-3">
          ĐĂNG NHẬP ADMIN
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
                placeholder="Mật khẩu"
                type="password"
                id="password"
                autoComplete="current-password"
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
            <label htmlFor="remember-me">Ghi nhớ đăng nhập</label>
          </div>

          {loi && (
            <div className="text-red-500 text-sm w-full text-center">{loi}</div>
          )}

          <button
            type="submit"
            className="bg-slate-600 mt-3 hover:from-slate-300 w-2/5 py-3 mx-auto text-center rounded-full
            active:opacity-40 transition-all duration-300 text-white font-semibold"
          >
            ĐĂNG NHẬP
          </button>
          <Link
            to="/forgot-password"
            className="text-black opacity-50 hover:opacity-90 text-center w-full font-medium mt-14"
          >
            Quên mật khẩu?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
