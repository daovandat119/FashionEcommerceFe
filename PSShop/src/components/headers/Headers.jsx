import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./components/Nav";
import CartLength from "./components/CartLength";
// import CartDrawer from "./components/CartDrawer";
// import { openCart } from "../../utlis/openCart";
import SearchBar from "./components/SearchBar";
import { LoginContext } from "../login/LoginContext";

export default function Headers() {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const { isAuthenticated } = useContext(LoginContext);
  const navigate = useNavigate();


  useEffect(() => {}, [isAuthenticated]);

  const toggleSearch = () => {
    setSearchVisible((prev) => !prev);
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      navigate("/account_dashboard");
    } else {
      navigate("/login_register");
    }
  };

  const handleSearchResults = () => {
    // console.log("Kết quả tìm kiếm:", results); // Đã loại bỏ log không cần thiết
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
            {/* Nút tìm kiếm */}
            {isSearchVisible ? (
              <div className="relative flex items-center">
                <SearchBar onSearch={handleSearchResults} />
                <button
                  className="absolute right-0 top-0 p-2 text-gray-500"
                  onClick={toggleSearch}
                >
                  x
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

            {/* Nút người dùng với dropdown */}
            <div className="header-tools__item hover-container relative">
              <button
                className="header-tools__item js-open-aside flex items-center justify-center p-2"
                onClick={handleUserClick}
              >
                <i className="fas fa-user text-black text-lg"></i>
              </button>
            </div>

            <Link
              className="header-tools__item flex items-center justify-center p-2"
              to="/account_wishlist"
            >
              <i className="fas fa-heart text-black text-lg"></i>
            </Link>

            {/* <a
            className="header-tools__item header-tools__cart js-open-aside flex items-center justify-center p-2 relative"
            onClick={() => openCart()}
          >
            
          </a> */}
            <Link to="/shop_cart" className="relative inline-block">
              <i className="fas fa-shopping-cart text-black text-lg"></i>
              <span className="cart-amount absolute -top-3 -right-3 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                <CartLength />
              </span>
            </Link>
          </div>
        </div>
      </div>
      {/* 
    <CartDrawer /> */}
    </header>
  );
}
