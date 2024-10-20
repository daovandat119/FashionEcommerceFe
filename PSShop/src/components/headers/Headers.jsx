import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "./components/Nav";
// import User from "./components/User";
import CartLength from "./components/CartLength";
import CartDrawer from "./components/CartDrawer"; // Nhập CartDrawer
import AuthPopup from "./components/AuthPopup";
import { openCart } from "../../utlis/openCart";
import { LoginProvider } from "../login/LoginContext";
export default function Headers() {
  const [isSearchVisible, setSearchVisible] = useState(false);
  
  const [isAuthOpen, setAuthOpen] = useState(false); 

  const toggleSearch = () => {
    setSearchVisible((prev) => !prev);
  };


  const toggleAuth = () => {
    setAuthOpen((prev) => !prev); 
  };

  return (
    <header id="header" className="header header_sticky">
      <div className="container">
        <div className="header-desk header-desk_type_1 d-flex align-items-center justify-content-between">
          <div className="logo">
            <Link to="/">
              <img
                src="/assets/images/logo.png"
                width={112}
                height={28}
                alt="PSSHOP"
                className="logo__image d-block"
              />
            </Link>
          </div>

          <nav className="navigation">
            <ul className="navigation__list list-unstyled d-flex">
              <Nav />
            </ul>
          </nav>

          <div className="header-tools d-flex align-items-center">
            {/* Thanh tìm kiếm */}
            {isSearchVisible ? (
              <div className="search-bar flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="search-input w-72 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={toggleSearch}
                  className="close-btn text-xl text-gray-500 hover:text-gray-700"
                >
                  &times; {/* Dấu "X" để đóng */}
                </button>
              </div>
            ) : (
              <div className="header-tools__item hover-container">
                <button
                  className="header-tools__item js-open-aside flex items-center justify-center p-2"
                  onClick={toggleSearch}
                >
                  <i className="fas fa-search text-black text-lg"></i>
                </button>
              </div>
            )}

            {/* Biểu tượng người dùng để mở AuthPopup */}
            <div className="header-tools__item hover-container">
              <button
                className="header-tools__item js-open-aside flex items-center justify-center p-2"
                onClick={toggleAuth}
              >
                <i className="fas fa-user text-black text-lg"></i> {/* Biểu tượng người dùng */}
              </button>
            </div>

            <Link className="header-tools__item flex items-center justify-center p-2" to="/account_wishlist">
              <i className="fas fa-heart text-black text-lg"></i> {/* Biểu tượng yêu thích */}
            </Link>

            <a
              className="header-tools__item header-tools__cart js-open-aside flex items-center justify-center p-2 relative"
              onClick={() => openCart()} // Gọi hàm toggleCart khi nhấn vào icon giỏ hàng
            >
              <i className="fas fa-shopping-cart text-black text-lg"></i> {/* Biểu tượng giỏ hàng */}
              <span
                className="cart-amount absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full"
              >
                <CartLength /> {/* Hiển thị số lượng sản phẩm trong giỏ */}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Drawer giỏ hàng */}
      { <CartDrawer />} {/* Hiển thị CartDrawer nếu isCartOpen là true */}

      {/* Popup đăng nhập/đăng ký */}
      <LoginProvider>
      <AuthPopup isOpen={isAuthOpen} closePopup={toggleAuth} />
      </LoginProvider>
    </header>
  );
}
