import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./components/Nav";
import CartLength from "./components/CartLength";
import CartDrawer from "./components/CartDrawer"; 

import { openCart } from "../../utlis/openCart";
import SearchBar from "./components/SearchBar"; 
import { LoginContext } from "../login/LoginContext";

export default function Headers() {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Header - isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  const toggleSearch = () => {
    setSearchVisible((prev) => !prev);
  };

  const handleUserClick = () => {
    console.log("Click - isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      navigate('/account_dashboard');
    } else {
      setDropdownOpen(!isDropdownOpen);
    }
  };

  const handleSearchResults = (results) => {
    console.log("Kết quả tìm kiếm:", results); 
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
            {/* Search button */}
            {isSearchVisible ? (
              <SearchBar onSearch={handleSearchResults} />
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

            {/* User button với dropdown */}
            <div className="header-tools__item hover-container relative">
              <button
                className="header-tools__item js-open-aside flex items-center justify-center p-2"
                onClick={handleUserClick}
              >
                <i className="fas fa-user text-black text-lg"></i>
              </button>

              {!isAuthenticated && isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                  {/* Header của dropdown với nút đóng */}
                  <div className="px-4 py-3 border-b relative">
                    <h3 className="text-sm font-medium text-gray-900">Tài khoản</h3>
                    <button 
                      onClick={() => setDropdownOpen(false)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <i className="fas fa-times text-sm"></i>
                    </button>
                  </div>
                  
                  {/* Menu item */}
                  <div className="py-2">
                    <Link
                      to="/login_register"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fas fa-sign-in-alt mr-3 text-gray-400"></i>
                      Đăng nhập / Đăng ký
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link className="header-tools__item flex items-center justify-center p-2" to="/account_wishlist">
              <i className="fas fa-heart text-black text-lg"></i>
            </Link>

            <a
              className="header-tools__item header-tools__cart js-open-aside flex items-center justify-center p-2 relative"
              onClick={() => openCart()}
            >
              <i className="fas fa-shopping-cart text-black text-lg"></i>
              <span className="cart-amount absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                <CartLength />
              </span>
            </a>
          </div>
        </div>
      </div>

      <CartDrawer />
    </header>
  );
}
