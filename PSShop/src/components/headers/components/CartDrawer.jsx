/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContextElement } from "../../../context/Context";

export default function CartDrawer() {
  const {
    cartProducts,
    totalPrice,
    loading,
    setQuantity,
    fetchCartItems,
  } = useContextElement();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  // Load giỏ hàng khi component mount và khi đăng nhập thay đổi
  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
    }
  }, [isLoggedIn, fetchCartItems]);

  // Load lại giỏ hàng khi thêm/sửa/xóa sản phẩm
  const handleQuantityChange = async (cartItemId, newQuantity) => {
    await setQuantity(cartItemId, newQuantity);
  };

  const closeCart = () => {
    document
      .getElementById("cartDrawerOverlay")
      .classList.remove("page-overlay_visible");
    document.getElementById("cartDrawer").classList.remove("aside_visible");
  };

  // Đóng cart khi chuyển trang
  useEffect(() => {
    closeCart();
  }, [pathname]);

  return (
    <>
      <div
        className="aside aside_right overflow-hidden cart-drawer"
        id="cartDrawer"
      >
        <div className="aside-header d-flex align-items-center">
          <h3 className="text-uppercase fs-6 mb-0">
            GIỎ HÀNG ({isLoggedIn ? cartProducts?.length || 0 : 0})
          </h3>
          <button
            onClick={closeCart}
            className="btn-close-lg js-close-aside btn-close-aside ms-auto"
          ></button>
        </div>

        {!isLoggedIn ? (
          <div className="p-4 text-center">
            <p className="mb-3">Vui lòng đăng nhập để xem giỏ hàng của bạn</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                closeCart();
                navigate('/login');
              }}
            >
              Đăng nhập
            </button>
          </div>
        ) : loading ? (
          <div className="p-4 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : cartProducts?.length ? (
          <div className="aside-content cart-drawer-items-list">
            {cartProducts.map((item) => (
              <React.Fragment key={item.CartItemID}>
                <div className="cart-drawer-item d-flex position-relative gap-3">
                  <div className="position-relative">
                    <img
                      loading="lazy"
                      className="cart-drawer-item__img"
                      src={item.ImageUrl}
                      alt={item.ProductName}
                    />
                  </div>
                  <div className="cart-drawer-item__info flex-grow-1">
                    <h6 className="cart-drawer-item__title fw-normal">
                      {item.ProductName}
                    </h6>
                    <p className="cart-drawer-item__option text-secondary">
                      Màu sắc: {item.ColorName}
                    </p>
                    <p className="cart-drawer-item__option text-secondary">
                      Kích thước: {item.SizeName}
                    </p>
                    <p className="cart-drawer-item__option text-secondary">
                      Đơn giá: ${item.Price}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex h-5 items-stretch border border-gray-300 rounded-md overflow-hidden">
                            <button
                                className="w-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleQuantityChange(item.CartItemID, item.Quantity - 1)}
                                disabled={loading || item.Quantity <= 1}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            
                            <div className="w-10 flex items-center justify-center bg-white border-x border-gray-300 text-sm">
                                {item.Quantity}
                            </div>
                            
                            <button
                                className="w-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleQuantityChange(item.CartItemID, item.Quantity + 1)}
                                disabled={loading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        {/* <button
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                            onClick={() => removeCartItem(item.CartItemID)}
                            disabled={loading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button> */}
                    </div>

                    <div className="mt-2 text-right">
                        <span className="text-sm font-medium text-gray-900">
                            Tổng: ${(item.Price * item.Quantity).toFixed(2)}
                        </span>
                    </div>
                  </div>
                </div>
                <hr className="cart-drawer-divider" />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="fs-18 mt-5 px-5">Giỏ hàng của bạn đang trống!</div>
        )}

        {/* Phần footer giỏ hàng */}
        <div className="cart-drawer-actions position-absolute start-0 bottom-0 w-100 p-3">
          <hr className="cart-drawer-divider" />
          {isLoggedIn && (
            <div className="d-flex justify-content-between mb-3">
              <h6 className="fs-base fw-medium mb-0">TỔNG TIỀN:</h6>
              <span className="cart-subtotal fw-medium">
                ${totalPrice}
              </span>
            </div>
          )}

          {isLoggedIn && cartProducts?.length ? (
            <>
              <Link 
                to="/shop_cart" 
                className="btn btn-outline-primary w-100 mb-2"
                onClick={closeCart}
              >
                Xem giỏ hàng
              </Link>
              <Link
                to="/shop_checkout"
                className="btn btn-primary w-100"
                onClick={closeCart}
              >
                Thanh toán
              </Link>
            </>
          ) : (
            <Link 
              to="/shop" 
              className="btn btn-light mt-3 d-block"
              onClick={closeCart}
            >
              Tiếp tục mua sắm
            </Link>
          )}
        </div>
      </div>
      <div
        id="cartDrawerOverlay"
        onClick={closeCart}
        className="page-overlay"
      ></div>
    </>
  );
}