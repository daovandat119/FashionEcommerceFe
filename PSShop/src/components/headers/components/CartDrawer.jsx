import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useContextElement } from "../../../context/Context";

export default function CartDrawer() {
  const { cartProducts, totalPrice, loading, updateCartItem, removeFromCart, fetchCartItems } = useContextElement();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const closeCart = () => {
    document.getElementById("cartDrawerOverlay").classList.remove("page-overlay_visible");
    document.getElementById("cartDrawer").classList.remove("aside_visible");
    setIsOpen(false);
  };

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    closeCart();
  }, [pathname]);

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    
    await updateCartItem(item.id, {
      productID: item.ProductID,
      colorID: item.ColorID,
      sizeID: item.SizeID,
      quantity: newQuantity
    });
  };

  return (
    <>
      <div className="aside aside_right overflow-hidden cart-drawer" id="cartDrawer">
        <div className="aside-header d-flex align-items-center">
          <h3 className="text-uppercase fs-6 mb-0">
            GIỎ HÀNG ({cartProducts?.length || 0})
          </h3>
          <button onClick={closeCart} className="btn-close-lg js-close-aside btn-close-aside ms-auto"></button>
        </div>

        {cartProducts?.length ? (
          <div className="aside-content cart-drawer-items-list">
            {cartProducts.map((item, i) => (
              <React.Fragment key={i}>
                <div className="cart-drawer-item d-flex position-relative">
                  <div className="position-relative">
                    <img
                      loading="lazy"
                      className="cart-drawer-item__img"
                      src={item.MainImageURL}
                      alt={item.product_name}
                    />
                  </div>
                  <div className="cart-drawer-item__info flex-grow-1">
                    <h6 className="cart-drawer-item__title fw-normal">
                      {item.product_name}
                    </h6>
                    <p className="cart-drawer-item__option text-secondary">
                      Màu sắc: {item.color}
                    </p>
                    <p className="cart-drawer-item__option text-secondary">
                      Kích thước: {item.size}
                    </p>
                    <p className="cart-drawer-item__option text-secondary">
                      Đơn giá: ${item.Price}
                    </p>
                    <div className="d-flex align-items-center justify-content-between mt-1">
                      <div className="qty-control position-relative">
                        <button
                          className="qty-control__reduce"
                          onClick={() => handleQuantityChange(item, item.Quantity - 1)}
                          disabled={loading || item.Quantity <= 1}
                        >
                          -
                        </button>
                        <span className="qty-control__number">
                          {item.Quantity}
                        </span>
                        <button
                          className="qty-control__increase"
                          onClick={() => handleQuantityChange(item, item.Quantity + 1)}
                          disabled={loading}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="btn btn-remove"
                        onClick={() => removeFromCart(item.id)}
                        disabled={loading}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <hr className="cart-drawer-divider" />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="fs-18 mt-5 px-5">
            Giỏ hàng của bạn đang trống!
          </div>
        )}

        <div className="cart-drawer-actions position-absolute start-0 bottom-0 w-100">
          <hr className="cart-drawer-divider" />
          <div className="d-flex justify-content-between">
            <h6 className="fs-base fw-medium">TỔNG TIỀN:</h6>
            <span className="cart-subtotal fw-medium">${totalPrice.toFixed(2)}</span>
          </div>

          {cartProducts?.length ? (
            <>
              <Link to="/shop_cart" className="btn btn-light mt-3 d-block">
                Xem giỏ hàng
              </Link>
              <Link to="/shop_checkout" className="btn btn-primary mt-3 d-block">
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
      <div id="cartDrawerOverlay" onClick={closeCart} className="page-overlay"></div>
    </>
  );
}
