import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra token hoặc trạng thái đăng nhập
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <>
      <li className="navigation__item">
        <a href="/" className={`navigation__link`}>
          Home
        </a>
      </li>
      <li className="navigation__item">
        <a href="/shop" className={`navigation__link`}>
          Shop
        </a>
      </li>
      <li className="navigation__item">
        <a href="/blogs" className={`navigation__link`}>
          Blog
        </a>
      </li>
      <li className="navigation__item">
        <Link to="/about" className={`navigation__link`}>
          About
        </Link>
      </li>
      <li className="navigation__item">
        <Link to="/contact" className={`navigation__link`}>
          Contact
        </Link>
      </li>

      {/* Hiển thị My Account khi đã đăng nhập */}
      {isLoggedIn && (
        <li className="navigation__item">
          <Link to="/account_dashboard" className={`navigation__link`}>
            My Account
          </Link>
        </li>
      )}
    </>
  );
}
