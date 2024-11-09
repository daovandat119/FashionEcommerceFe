import { Link, useLocation, useNavigate } from "react-router-dom";

export default function DashboardSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const dashboardMenuItems = [
    { id: 1, href: "/account_dashboard", title: "Dashboard" },
    { id: 2, href: "/account_orders", title: "Orders" },
    { id: 3, href: "/account_edit_address", title: "Addresses" },
    { id: 4, href: "/account_edit", title: "Account Details" },
    { id: 5, href: "/account_wishlist", title: "Wishlist" },
    { id: 6, href: "/login_register", title: "LOGOUT" }, // Changed to "Logout"
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
          <li key={elm.id}>
            {elm.title === "LOGOUT" ? (
              <button
                onClick={handleLogout}
                className="menu-link menu-link_us-s"
              >
                {elm.title}
              </button>
            ) : (
              <Link
                to={elm.href}
                className={`menu-link menu-link_us-s ${
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