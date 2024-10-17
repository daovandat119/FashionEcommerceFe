import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext"; // Import context

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Password: "",
  });

  const { login, register, error, success } = useContext(LoginContext); // Sử dụng context
  const navigate = useNavigate();

  // Khi đăng nhập thành công hoặc đăng ký thành công, điều hướng đến trang tương ứng
  useEffect(() => {
    if (success) {
      if (!isLogin) {
        // Chuyển về trang login sau khi đăng ký thành công
        setTimeout(() => {
          setIsLogin(true);
        }, 2000);
      } else {
        // Chuyển về trang chủ sau khi đăng nhập thành công
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
  }, [success, isLogin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(formData.Email, formData.Password);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    await register(formData.Username, formData.Email, formData.Password);
  };

  return (
    <section className="container mx-auto p-4 w-full md:w-2/3 lg:w-1/2">
      <h2 className="sr-only">Login & Register</h2>

      {/* Tab Navigation */}
      <ul className="flex justify-center space-x-6 mb-5" role="tablist">
        <li className="cursor-pointer" role="presentation">
          <button
            className={`py-2 px-4 ${isLogin ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
        </li>
        <li className="cursor-pointer" role="presentation">
          <button
            className={`py-2 px-4 ${!isLogin ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </li>
      </ul>

      {/* Thông báo lỗi hoặc thành công */}
      <div className="pt-2">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="relative">
              <input
                name="Email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email address *"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <input
                name="Password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password *"
                value={formData.Password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="w-full flex align-center justify-center">
              <button className="btn w-[250px] bg-black text-white py-2 rounded" type="submit">
                Log In
              </button>
            </div>
            <div className="text-center mt-4">
              <span className="text-gray-600">No account yet?</span>{" "}
              <button className="text-blue-500 hover:underline" onClick={() => setIsLogin(false)}>
                Create Account
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="relative">
              <input
                name="Username"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
                value={formData.Username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <input
                name="Email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email address *"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <input
                name="Password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password *"
                value={formData.Password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="w-full flex align-center justify-center">
              <button className="w-[250px] bg-black text-white py-2 rounded" type="submit">
                Register
              </button>
            </div>
            <div className="text-center mt-4">
              <span className="text-gray-600">Already have an account?</span>{" "}
              <button className="text-blue-500 hover:underline" onClick={() => setIsLogin(true)}>
                Login here
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
