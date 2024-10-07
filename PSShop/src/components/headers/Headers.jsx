import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "./components/Nav";
import User from "./components/User";
import CartLength from "./components/CartLength";

export default function Headers() {
    const [isSearchVisible, setSearchVisible] = useState(false);

    const toggleSearch = () => {
        setSearchVisible((prev) => !prev);
    };

    return (
        <header id="header" className="header header_sticky">
            <div className="container">
                <div className="header-desk header-desk_type_1 d-flex align-items-center">
                    <div className="logo">
                        <Link to="/">
                            <img
                                src="/assets/images/logo.png"
                                width={112}
                                height={28}
                                alt="Uomo"
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
                        {/* Ẩn biểu tượng tìm kiếm khi thanh tìm kiếm được hiển thị */}
                        {!isSearchVisible && (
                            <div className="header-tools__item hover-container">
                                <a
                                    className="header-tools__item js-open-aside"
                                    onClick={toggleSearch}
                                    href="#"
                                >
                                    <i className="fas fa-search"></i>
                                </a>
                            </div>
                        )}

                        {isSearchVisible && (
                            <div className="search-bar d-flex align-items-center">
                                <input type="text" placeholder="Tìm kiếm..." />
                                <button onClick={toggleSearch} className="close-btn">
                                    &times; {/* Dấu "X" để đóng */}
                                </button>
                            </div>
                        )}

                        <div className="header-tools__item hover-container">
                            <a className="header-tools__item js-open-aside" href="#">
                                <i className="fas fa-user"></i> {/* Biểu tượng người dùng */}
                            </a>
                        </div>

                        <Link className="header-tools__item" to="/account_wishlist">
                            <i className="fas fa-heart"></i> {/* Biểu tượng yêu thích */}
                        </Link>

                        <a
                            className="header-tools__item header-tools__cart js-open-aside"
                            onClick={() => openCart()}
                        >
                            <i className="fas fa-shopping-cart"></i> {/* Biểu tượng giỏ hàng */}
                            <span className="cart-amount d-block position-absolute js-cart-items-count">
                                <CartLength />
                            </span>
                        </a>

                        <a
                            className="header-tools__item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#siteMap"
                        >
                            <i className="fas fa-th-list"></i> {/* Biểu tượng danh sách */}
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
