// AuthPopup.jsx
import React, { useState } from "react";

export default function AuthPopup({ isOpen, closePopup }) {
  const [isLogin, setIsLogin] = useState(true); // Trạng thái để chuyển đổi giữa đăng nhập và đăng ký

  if (!isOpen) return null; // Ẩn popup nếu `isOpen` là false

  return (
    <div className="relative z-10" aria-labelledby="auth-popup-title" role="dialog" aria-modal="true">
      {/* Background backdrop */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

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

                  {/* Nội dung đăng nhập/đăng ký */}
                  <div className="mt-8">
                    <div className="flow-root">
                      {isLogin ? (
                        <form className="space-y-6">
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              autoComplete="email"
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
                              required
                              placeholder="Password"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <button
                              type="submit"
                              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dark  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Login
                            </button>
                          </div>
                        </form>
                      ) : (
                        <form className="space-y-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                             Username
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              autoComplete="name"
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
                              required
                              placeholder="Email"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                              Password                            </label>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              autoComplete="new-password"
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
                         Don't have account?{" "}
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
                          You have account?{" "}
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
