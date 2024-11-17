/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useContextElement } from "../../../context/Context";

export default function CartDrawer() {
  const {
    cartProducts,
    totalPrice,
    loading,
    setQuantity,
    // removeSelectedItems,
    fetchCartItems,
    // setCartProducts,
  } = useContextElement();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const closeCart = () => {
    document
      .getElementById("cartDrawerOverlay")
      .classList.remove("page-overlay_visible");
    document.getElementById("cartDrawer").classList.remove("aside_visible");
    setIsOpen(false);
    fetchCartItems();
  };

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    closeCart();
  }, [pathname]);

  // const removeSelectedItem = async () => {
  //   await removeSelectedItems();
  // };
  return (
    <>
      <div
        className="aside aside_right overflow-hidden cart-drawer"
        id="cartDrawer"
      >
        <div className="aside-header d-flex align-items-center">
          <h3 className="text-uppercase fs-6 mb-0">
            GIỎ HÀNG ({cartProducts?.length || 0})
          </h3>
          <button
            onClick={closeCart}
            className="btn-close-lg js-close-aside btn-close-aside ms-auto"
          ></button>
        </div>

        {cartProducts?.length ? (
          <div className="aside-content cart-drawer-items-list">
            {cartProducts.map((item, i) => (
              <React.Fragment key={i}>
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
                    <div className="flex items-center justify-between w-32">
                      <div className="flex items-center space-x-2">
                        <button
                          className="w-4 h-4 flex items-center justify-center border rounded"
                          onClick={() => {
                            setQuantity(item.CartItemID, item.Quantity - 1);
                          }}
                          disabled={loading || item.Quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{item.Quantity}</span>
                        <button
                          className="w-4 h-4 flex items-center justify-center border rounded"
                          onClick={() => {
                            setQuantity(item.CartItemID, item.Quantity + 1);
                          }}
                          disabled={loading}
                        >
                          +
                        </button>
                      </div>
                      {/* <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeSelectedItems(item.CartItemID)}
                        disabled={loading}
                      >
                        <i className="fas fa-trash"></i>
                      </button> */}
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

        <div className="cart-drawer-actions position-absolute start-0 bottom-0 w-100">
          <hr className="cart-drawer-divider" />
          <div className="d-flex justify-content-between">
            <h6 className="fs-base fw-medium">TỔNG TIỀN:</h6>
            <span className="cart-subtotal fw-medium">
              ${totalPrice}
            </span>
          </div>

          {cartProducts?.length ? (
            <>
              <Link to="/shop_cart" className="btn btn-light mt-3 d-block">
                Xem giỏ hàng
              </Link>
              <Link
                to="/shop_checkout"
                className="btn btn-primary mt-3 d-block"
              >
                Thanh toán
              </Link>
            </>
          ) : (
            <Link to="/shop" className="btn btn-light mt-3 d-block">
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