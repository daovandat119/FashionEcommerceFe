import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true); // State to control tab display

  return (
    <section className="container mx-auto p-4 w-full md:w-2/3 lg:w-1/2">
      <h2 className="sr-only">Login & Register</h2>
      {/* Tab Navigation */}
      <ul
        className="flex justify-center space-x-6 mb-5"
        id="login_register"
        role="tablist"
      >
        <li className="cursor-pointer" role="presentation">
          <button
            className={`py-2 px-4 ${
              isLogin ? "text-black border-b-2 border-black" : "text-gray-500"
            }`}
            onClick={() => setIsLogin(true)} // Show Login tab
          >
            Login
          </button>
        </li>
        <li className="cursor-pointer" role="presentation">
          <button
            className={`py-2 px-4 ${
              !isLogin ? "text-black border-b-2 border-black" : "text-gray-500"
            }`}
            onClick={() => setIsLogin(false)} // Show Register tab
          >
            Register
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="pt-2">
        {/* Login Form */}
        {isLogin ? (
          <div
            className="tab-pane fade show active"
            id="tab-item-login"
            role="tabpanel"
            aria-labelledby="login-tab"
          >
            <div className="login-form">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="relative">
                  <input
                    name="login_email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email address *"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    name="login_password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Password *"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      name="remember"
                      type="checkbox"
                      className="form-checkbox text-blue-500"
                    />
                    <label className="ml-2 text-gray-600">Remember me</label>
                  </div>
                  <Link
                    to="/reset_password"
                    className="text-blue-500 hover:underline"
                  >
                    Lost password?
                  </Link>
                </div>
                <div className="w-full flex align-center justify-center">
                  <button
                    className="btn w-[250px] bg-black text-white py-2 rounded"
                    type="submit"
                  >
                    Log In
                  </button>
                </div>
                <div className="text-center mt-4">
                  <span className="text-gray-600">No account yet?</span>{" "}
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setIsLogin(false)}
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          // Register Form
          <div
            className="tab-pane fade show active"
            id="tab-item-register"
            role="tabpanel"
            aria-labelledby="register-tab"
          >
            <div className="register-form">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="relative">
                  <input
                    name="register_username"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Username"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    name="register_email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email address *"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    name="register_password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Password *"
                    required
                  />
                </div>

                <div className="text-gray-600">
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account, and
                  for other purposes described in our privacy policy.
                </div>
                <div className="w-full flex align-center justify-center">
                  <button
                    className="w-[250px] bg-black text-white py-2 rounded"
                    type="submit"
                  >
                    Register
                  </button>
                </div>
                <div className="text-center mt-4">
                  <span className="text-gray-600">
                    Already have an account?
                  </span>{" "}
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setIsLogin(true)}
                  >
                    Login here
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
