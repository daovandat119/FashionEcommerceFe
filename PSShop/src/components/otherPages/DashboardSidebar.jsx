import { Link, useLocation, useNavigate } from "react-router-dom";

export default function DashboardSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const dashboardMenuItems = [
    // { id: 1, href: "/account_dashboard", title: "BẢNG ĐIỀU KHIỂN" },
    { id: 2, href: "/account_orders", title: "ĐƠN HÀNG " },
    { id: 3, href: "/account_edit_address", title: "ĐỊA CHỈ" },
    { id: 4, href: "/account_edit", title: "Chi tiết tài khoản" },
    { id: 5, href: "/account_wishlist", title: "SẢN PHẨM YÊU THÍCH" },
    { id: 6, href: "/login_register", title: "ĐĂNG XUẤT" },
  ];

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token
    navigate("/login_register"); // Điều hướng về trang đăng nhập
  };

  return (
    <div className="col-lg-3">
      <ul className="account-nav">
        {dashboardMenuItems.map((elm) => (  
          <li key={elm.id} className="mb-2">
            {elm.title === "ĐĂNG XUẤT" ? (
              <button
                onClick={handleLogout}
                className="menu-link menu-link_us-s text-lg font-semibold text-gray-800 
                  hover:text-blue-600 transition-colors duration-300"
              >
                {elm.title}
              </button>
            ) : (
              <Link
                to={elm.href}
                className={`menu-link menu-link_us-s text-lg font-semibold text-gray-800 
                  hover:text-blue-600 transition-colors duration-300 ${
                    pathname === elm.href ? "menu-link_active" : ""
                  }`}
              >
                {elm.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}