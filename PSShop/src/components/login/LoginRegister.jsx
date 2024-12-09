import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext"; // Đảm bảo đúng đường dẫn
import GoogleLogin from "./GoogleLogin"; // Component đăng nhập bằng Google

export default function LoginRegister() {
  const {
    registerUser,
    loginUser,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    errorMessage,
    successMessage,
    tempEmail,
    userId,
  } = useContext(LoginContext);

  const [currentView, setCurrentView] = useState("login"); // "login", "register", "verify", "forgotPassword"
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginUser(loginEmail, loginPassword, navigate);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    registerUser(registerUsername, registerEmail, registerPassword).then(() =>
      setCurrentView("verify")
    );
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    verifyEmail(verificationCode, userId, navigate);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    forgotPassword(forgotPasswordEmail).then(() => {
      setCurrentView("login");
      setLoginEmail(forgotPasswordEmail);
    });
  };

  const renderLoginForm = () => (
    <div className="login-form">
      <h2 className="text-center mb-4 ">ĐĂNG NHẬP</h2>
      <form onSubmit={handleLoginSubmit}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <label>Email</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Mật khẩu"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <label>Mật khẩu</label>
        </div>
        <div className="d-flex justify-content-between">
          <div>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" className="ms-2">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setCurrentView("forgotPassword")}
          >
            Quên mật khẩu?
          </button>
        </div>
        <button className="btn btn-primary w-100 mt-3">Đăng nhập</button>
      </form>
      <div className="text-center mt-4">
        <GoogleLogin />
      </div>
      <div className="text-center mt-3">
        <span>Chưa có tài khoản?</span>{" "}
        <button
          className="btn btn-link"
          onClick={() => setCurrentView("register")}
        >
          Đăng ký ngay
        </button>
      </div>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="register-form">
      <h2 className="text-center mb-4">ĐĂNG KÝ</h2>
      <form onSubmit={handleRegisterSubmit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tên người dùng"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            required
          />
          <label>Tên người dùng</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
          />
          <label>Email</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Mật khẩu"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
          <label>Mật khẩu</label>
        </div>
        <button className="btn btn-primary w-100 mt-3">Đăng ký</button>
      </form>
      <div className="text-center mt-3">
        <button
          className="btn btn-link"
          onClick={() => setCurrentView("login")}
        >
          Quay về Đăng nhập
        </button>
      </div>
    </div>
  );

  const renderVerificationForm = () => (
    <div className="verification-form">
      <h4 className="text-center mb-4">Xác thực email</h4>
      <p className="text-center">Mã xác thực đã được gửi tới: {tempEmail}</p>
      <form onSubmit={handleVerificationSubmit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Mã xác thực"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <label>Mã xác thực</label>
        </div>
        <button className="btn btn-primary w-100 mt-3">Xác thực</button>
      </form>
      <div className="text-center mt-3 ">
        <button className="btn btn-link" onClick={resendVerificationCode}>
          Gửi lại mã
        </button>

        <button
          className="btn btn-link ml-7"
          onClick={() => setCurrentView("login")}
        >
          Quay về Đăng nhập
        </button>
      </div>
    </div>
  );

  const renderForgotPasswordForm = () => (
    <div className="forgot-password-form">
      <h4 className="text-center mb-4">Quên mật khẩu</h4>
      <form onSubmit={handleForgotPasswordSubmit}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            required
          />
          <label>Email</label>
        </div>
        <button className="btn btn-primary w-100 mt-3">
          Gửi yêu cầu đặt lại mật khẩu
        </button>
      </form>
      <div className="text-center mt-3">
        <button
          className="btn btn-link"
          onClick={() => setCurrentView("login")}
        >
          Quay về Đăng nhập
        </button>
      </div>
    </div>
  );

  return (
    <div className="login-register container">
      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {currentView === "login" && renderLoginForm()}
      {currentView === "register" && renderRegisterForm()}
      {currentView === "verify" && renderVerificationForm()}
      {currentView === "forgotPassword" && renderForgotPasswordForm()}
    </div>
  );
}
