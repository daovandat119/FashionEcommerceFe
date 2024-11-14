/* eslint-disable no-unused-vars */
import { useContextElement } from "../../context/Context";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Cart() {
  const {
    cartProducts,
    totalPrice,
    loading,
    checkboxes,
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    removeSelectedItems,
    formatPrice,
    setQuantity,
    handleCheckboxChange,
    removeCartItem,
    fetchCartItems,
  } = useContextElement();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCartItems(); // Fetch dữ liệu khi component mount
  }, [fetchCartItems]);

  const applyCoupon = async () => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (!token) {
      setError("Vui lòng đăng nhập để áp dụng mã giảm giá.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/coupons/details", { Code: couponCode }, {
        headers: { Authorization: `Bearer ${token}` }, // Thêm header xác thực
      });
      const coupon = response.data.data;

      if (coupon) {
        if (totalPrice >= coupon.MinimumOrderValue) {
          const discountAmount = (totalPrice * coupon.DiscountPercentage) / 100;
          setDiscount(discountAmount);
          setError(""); // Xóa thông báo lỗi nếu áp dụng thành công
        } else {
          setError("Mã không được áp dụng. Giá trị đơn hàng phải lớn hơn " + coupon.MinimumOrderValue);
        }
      } else {
        setError("Mã giảm giá không hợp lệ.");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError("Bạn cần đăng nhập để thực hiện hành động này.");
      } else {
        setError("Lỗi khi kiểm tra mã giảm giá.");
      }
    }
  };

  return (
    <div className="shopping-cart" style={{ minHeight: "calc(100vh - 300px)" }}>
      <div className="cart-table__wrapper">
        {cartProducts.length ? (
          <>
           

            <table className="cart-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={
                        selectedItems.length === cartProducts.length &&
                        cartProducts.length > 0
                      }
                    />
                  </th>
                  <th>Product</th>
                  <th>Color and Size</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map((item) => (
                  <tr key={item.CartItemID}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.CartItemID)}
                        onChange={() => handleSelectItem(item.CartItemID)}
                      />
                    </td>
                    <td>
                      <div className="shopping-cart__product-item">
                        {item.MainImageURL && (
                          <img
                            loading="lazy"
                            src={item.MainImageURL}
                            width="120"
                            height="120"
                            alt={item.product_name}
                            className="object-fit-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="shopping-cart__product-item__detail">
                        <h4>{item.product_name}</h4>
                        <ul className="shopping-cart__product-item__options">
                          <li>Color: {item.color}</li>
                          <li>Size: {item.size}</li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__product-price">
                        ${formatPrice(item.Price)}
                      </span>
                    </td>
                    <td>
                      <div className="qty-control position-relative">
                        <input
                          type="number"
                          name="quantity"
                          value={item.Quantity}
                          min={1}
                          onChange={(e) =>
                            setQuantity(
                              item.CartItemID,
                              parseInt(e.target.value)
                            )
                          }
                          className="qty-control__number text-center"
                        />
                        <div
                          onClick={() =>
                            setQuantity(item.CartItemID, item.Quantity - 1)
                          }
                          className="qty-control__reduce"
                        >
                          -
                        </div>
                        <div
                          onClick={() =>
                            setQuantity(item.CartItemID, item.Quantity + 1)
                          }
                          className="qty-control__increase"
                        >
                          +
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__subtotal">
                        ${formatPrice(item.total_price)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-table-footer d-flex justify-content-between align-items-center mt-4">
              <div className="d-flex gap-3">
                <button
                  className="btn btn-danger"
                  onClick={() => removeSelectedItems()}
                  disabled={selectedItems.length === 0 || loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  Xóa sản phẩm đã chọn ({selectedItems.length})
                </button>
              </div>
            </div>

<br /><br />
            <div className="coupon-section">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
                className="form-control"
              />
              <button onClick={applyCoupon} className="btn btn-primary">
                Áp dụng
              </button>
              {error && <div className="text-danger">{error}</div>}
            </div>


          </>
        ) : (
          <>
            <div className="fs-20">Shop cart is empty</div>
            <button className="btn mt-3 btn-light">
              <Link to={"/shop-1"}>Explore Products</Link>
            </button>
          </>
        )}
      </div>
      {/* Phần Cart Totals */}
      {cartProducts.length > 0 && (
        <div className="shopping-cart__totals-wrapper">
          <div className="sticky-content">
            <div className="shopping-cart__totals">
              <h3>Cart Totals</h3>
              <table className="cart-totals">
                <tbody>
                  <tr>
                    <th>Subtotal</th>
                    <td>${formatPrice(totalPrice)}</td>
                  </tr>
                  <tr>
                    <th>Discount</th>
                    <td>${formatPrice(discount)}</td>
                  </tr>
                  <tr>
                    <th>Total</th>
                    <td>
                      $
                      {formatPrice(
                        parseFloat(totalPrice) - discount +
                          (checkboxes.flat_rate ? 49 : 0) +
                          (checkboxes.local_pickup ? 8 : 0)
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Link
                to="/shop_checkout"
                className="btn btn-primary w-100 mt-3"
                onClick={(e) => {
                  if (cartProducts.length === 0) {
                    e.preventDefault();
                    alert("Giỏ hàng trống!");
                  }
                }}
              >
                PROCEED TO CHECKOUT
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
