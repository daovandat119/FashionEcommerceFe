import React, { useState, useContext } from "react";
import { LoginContext } from "../../login/LoginContext"; // Đảm bảo đúng đường dẫn

export default function AuthPopup({ isOpen, closePopup }) {
  const { 
    registerUser, 
    loginUser, 
    verifyEmail,
    resendVerificationCode,
    errorMessage, 
    successMessage,
    verificationStep,
    tempEmail,
    userId
  } = useContext(LoginContext);
  const [isLogin, setIsLogin] = useState(true); // Trạng thái để chuyển đổi giữa đăng nhập và đăng ký
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password, closePopup); // Đóng popup sau khi đăng nhập thành công
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    registerUser(username, email, password, closePopup); // Đóng popup sau khi đăng ký thành công
  };
  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    verifyEmail(verificationCode, userId, closePopup);
  };

  if (!isOpen) return null; // Ẩn popup nếu `isOpen` là false
  if (verificationStep) {
    return (
      <div className="relative z-10" aria-labelledby="auth-popup-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">
                        Email Verification
                      </h2>
                      <button onClick={closePopup} className="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Close panel</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {errorMessage && <div className="alert alert-danger mt-4">{errorMessage}</div>}
                    {successMessage && <div className="alert alert-success mt-4">{successMessage}</div>}

                    <form onSubmit={handleVerificationSubmit} className="mt-8 space-y-6">
                      <p className="text-center text-gray-600">
                        Mã xác thực đã được gửi đến email: {tempEmail}
                      </p>
                      
                      <div>
                        <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          id="verification-code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                          required
                          placeholder="Enter verification code"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dark"
                      >
                        Verify
                      </button>

                      <button
                        type="button"
                        onClick={resendVerificationCode}
                        className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
                      >
                        Resend verification code
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative z-10" aria-labelledby="auth-popup-title" role="dialog" aria-modal="true">
      {/* Background backdrop */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            {/* Slide-over panel */}
            <div className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900" id="auth-popup-title">
                      {isLogin ? "Login" : "Register"}
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        onClick={closePopup} // Thêm hàm đóng popup
                      >
                        <span className="absolute -inset-0.5"></span>
                        <span className="sr-only">Close panel</span>
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Hiển thị lỗi và thông báo thành công */}
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  {successMessage && <div className="alert alert-success">{successMessage}</div>}

                  {/* Nội dung đăng nhập/đăng ký */}
                  <div className="mt-8">
                    <div className="flow-root">
                      {isLogin ? (
                        <form className="space-y-6" onSubmit={handleLoginSubmit}>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              autoComplete="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              placeholder="Email"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              autoComplete="current-password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              placeholder="Password"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <button
                              type="submit"
                              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Login
                            </button>
                          </div>
                        </form>
                      ) : (
                        <form className="space-y-6" onSubmit={handleRegisterSubmit}>
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Username
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              autoComplete="name"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                              placeholder="Username"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              autoComplete="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              placeholder="Email"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              autoComplete="new-password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              placeholder="Password"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <button
                              type="submit"
                              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Register
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Chuyển đổi giữa đăng nhập và đăng ký */}
                  <div className="mt-6 flex items-center justify-center">
                    <div className="text-sm">
                      {isLogin ? (
                        <p>
                          No account?{" "}
                          <button
                            type="button"
                            className="font-medium text-dark"
                            onClick={() => setIsLogin(false)}
                          >
                            Register
                          </button>
                        </p>
                      ) : (
                        <p>
                          Have an account?{" "}
                          <button
                            type="button"
                            className="font-medium text-dark"
                            onClick={() => setIsLogin(true)}
                          >
                            Login
                          </button>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
