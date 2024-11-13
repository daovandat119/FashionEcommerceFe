import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext"; // Đảm bảo đúng đường dẫn
import GoogleLogin from './GoogleLogin'; // Import component đăng nhập bằng Google

export default function LoginRegister() {
  const { 
    registerUser, 
    loginUser, 
    verifyEmail, 
    resendVerificationCode, 
    errorMessage, 
    successMessage,
    verificationStep, 
    tempEmail, 
    userId,
    forgotPassword // Thêm forgotPassword vào context
  } = useContext(LoginContext);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(""); // Thêm trạng thái quên mật khẩu
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Trạng thái hiển thị form quên mật khẩu
  const navigate = useNavigate();
  
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginUser(loginEmail, loginPassword, navigate);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    registerUser(registerUsername, registerEmail, registerPassword, navigate);
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    verifyEmail(verificationCode, userId, navigate);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    forgotPassword(forgotPasswordEmail).then(() => {
        // Chuyển hướng về trang đăng nhập sau khi gửi yêu cầu thành công
        setShowForgotPassword(false);
        setLoginEmail(forgotPasswordEmail); // Tự động điền email vào ô đăng nhập
    });
};

  if (verificationStep && tempEmail) {
    return (
      <section className="login-register container">
        <h2 className="d-none">Email Verification</h2>
        
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="login-form">
          <form onSubmit={handleVerificationSubmit} className="needs-validation">
            <h4 className="text-center mb-4">Xác thực email</h4>
            <p className="text-center mb-4">
              Mã xác thực đã được gửi đến email: {tempEmail}
            </p>
            
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control form-control_gray"
                placeholder="Nhập mã xác thực"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                required
              />
              <label>Nhập mã xác thực</label>
            </div>

            <button className="btn btn-primary w-100 text-uppercase mb-3" type="submit">
              Xác thực
            </button>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-link"
                onClick={resendVerificationCode}
              >
                Gửi lại mã xác thực
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  } else if (showForgotPassword) { // Hiển thị form quên mật khẩu
    return (
      <section className="login-register container">
        <h2 className="d-none">Quên mật khẩu</h2>
        
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="forgot-password-form">
          <form onSubmit={handleForgotPasswordSubmit} className="needs-validation">
            <h4 className="text-center mb-4">Quên mật khẩu</h4>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control form-control_gray"
                placeholder="Nhập email của bạn"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
              />
              <label>Nhập email của bạn</label>
            </div>

            <button className="btn btn-primary w-100 text-uppercase mb-3" type="submit">
              Gửi yêu cầu đặt lại mật khẩu
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="login-register container">
      <h2 className="d-none">Login & Register</h2>
      
      {/* Hiển thị lỗi và thông báo thành công */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <ul className="nav nav-tabs mb-5" id="login_register" role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className="nav-link nav-link_underscore active"
            id="login-tab"
            data-bs-toggle="tab"
            href="#tab-item-login"
            role="tab"
            aria-controls="tab-item-login"
            aria-selected="true"
          >
            Login
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link nav-link_underscore"
            id="register-tab"
            data-bs-toggle="tab"
            href="#tab-item-register"
            role="tab"
            aria-controls="tab-item-register"
            aria-selected="false"
          >
            Register
          </a>
        </li>
      </ul>

      <div className="tab-content pt-2" id="login_register_tab_content">
        {/* Form đăng nhập */}
        <div
          className="tab-pane fade show active"
          id="tab-item-login"
          role="tabpanel"
          aria-labelledby="login-tab"
        >
          <div className="login-form">
            <form onSubmit={handleLoginSubmit} className="needs-validation">
              <div className="form-floating mb-3">
                <input
                  name="login_email"
                  type="email"
                  className="form-control form-control_gray"
                  placeholder="Email address *"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
                <label>Email address *</label>
              </div>

              <div className="pb-3"></div>

              <div className="form-floating mb-3">
                <input
                  name="login_password"
                  type="password"
                  className="form-control form-control_gray"
                  id="customerPasswodInput"
                  placeholder="Password *"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <label htmlFor="customerPasswodInput">Password *</label>
              </div>

              <div className="d-flex align-items-center mb-3 pb-2">
                <div className="form-check mb-0">
                  <input
                    name="remember"
                    className="form-check-input form-check-input_fill"
                    type="checkbox"
                    defaultValue=""
                  />
                  <label className="form-check-label text-secondary">
                    Remember me
                  </label>
                </div>
                <button type="button" className="btn-text ms-auto" onClick={() => setShowForgotPassword(true)}>
                  Quên mật khẩu?
                </button>
              </div>

              <button className="btn btn-primary w-100 text-uppercase" type="submit">
                Log In
              </button>

              <div className="customer-option mt-4 text-center">
                <span className="text-secondary">No account yet?</span>{" "}
                <a href="#register-tab" className="btn-text js-show-register">
                  Create Account
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Form đăng ký */}
        <div
          className="tab-pane fade"
          id="tab-item-register"
          role="tabpanel"
          aria-labelledby="register-tab"
        >
          <div className="register-form">
            <form onSubmit={handleRegisterSubmit} className="needs-validation">
              <div className="form-floating mb-3">
                <input
                  name="register_username"
                  type="text"
                  className="form-control form-control_gray"
                  id="customerNameRegisterInput"
                  placeholder="Username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                />
                <label htmlFor="customerNameRegisterInput">Username</label>
              </div>

              <div className="pb-3"></div>

              <div className="form-floating mb-3">
                <input
                  name="register_email"
                  type="email"
                  className="form-control form-control_gray"
                  id="customerEmailRegisterInput"
                  placeholder="Email address *"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
                <label htmlFor="customerEmailRegisterInput">
                  Email address *
                </label>
              </div>

              <div className="pb-3"></div>

              <div className="form-floating mb-3">
                <input
                  name="register_password"
                  type="password"
                  className="form-control form-control_gray"
                  id="customerPasswodRegisterInput"
                  placeholder="Password *"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
                <label htmlFor="customerPasswodRegisterInput">Password *</label>
              </div>

              <div className="d-flex align-items-center mb-3 pb-2">
                <p className="m-0">
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account, and
                  for other purposes described in our privacy policy.
                </p>
              </div>

              <button className="btn btn-primary w-100 text-uppercase" type="submit">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Giao diện đăng nhập bằng Google */}
      <div className="text-center mt-4">
        <GoogleLogin />
      </div>
    </section>
  );
}