/* eslint-disable no-unused-vars */
import { useContextElement } from "../../context/Context";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Cart() {
  const {
    cartProducts,
    totalPrice,
    loading,
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    removeSelectedItems,
    fetchCartItems,
  } = useContextElement();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    fetchCartItems(); 
  }, [fetchCartItems]);

  const handleError = (message) => {
    setError(message);
  };

  const applyCoupon = async () => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      handleError("Vui lòng đăng nhập để áp dụng mã giảm giá.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/coupons/details", { Code: couponCode }, {
        headers: { Authorization: `Bearer ${token}` }, 
      });
      const coupon = response.data.data;

      if (coupon) {
        if (totalPrice >= coupon.MinimumOrderValue) {
          const discountAmount = (totalPrice * coupon.DiscountPercentage) / 100;
          setDiscount(discountAmount);
          handleError(""); 
        } else {
          handleError("Mã không được áp dụng. Giá trị đơn hàng phải lớn hơn " + coupon.MinimumOrderValue);
        }
      } else {
        handleError("Mã giảm giá không hợp lệ.");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        handleError("Bạn cần đăng nhập để thực hiện hành động này.");
      } else {
        handleError("Lỗi khi kiểm tra mã giảm giá.");
      }
    }
  };

  const handleQuantityChange = async (itemId, productID, colorID, sizeID, newQuantity) => {
    if (newQuantity < 1) return; 

    const token = localStorage.getItem("token"); 
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/cart-items/${itemId}`, {
        productID, 
        colorID, 
        sizeID, 
        quantity: newQuantity,
      }, {
        headers: { Authorization: `Bearer ${token}` }, 
      });
      fetchCartItems();
      if (response.status === 400) {
        alert("Số lượng không hợp lệ.");
      }

    } catch (err) {
      console.error(err);
      handleError("Lỗi khi cập nhật số lượng."); 
    }
  };

  const handleQuantityChangeDebounced = (itemId, productID, colorID, sizeID, newQuantity) => {
    if (newQuantity < 1) return; 
    handleQuantityChange(itemId, productID, colorID, sizeID, newQuantity);
  };


  return (
    <div className="shopping-cart" style={{ minHeight: "calc(100vh - 300px)", padding: "20px", backgroundColor: "#f9f9f9" }}>
      <ToastContainer />
      <div className="cart-table__wrapper">
        {cartProducts.length ? (
          <>
            <table className="cart-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>
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
                  <th width="10%" className="text-center">Quantity</th>
                  <th width="20%" className="text-center">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map((item) => (
                  <tr key={item.CartItemID} style={{ borderBottom: "1px solid #ddd" }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.CartItemID)}
                        onChange={() => handleSelectItem(item.CartItemID)}
                      />
                    </td>
                    <td>
                      <div className="shopping-cart__product-item">
                        {item.ImageUrl && (
                          <img
                            loading="lazy"
                            src={item.ImageUrl}
                            width="120"
                            height="120"
                            alt={item.ProductName}
                            className="object-fit-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="shopping-cart__product-item__detail">
                        <h4>{item.ProductName}</h4>
                        <ul className="shopping-cart__product-item__options">
                          <li>Color: {item.ColorName}</li>
                          <li>Size: {item.SizeName}</li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__product-price">
                        ${item.Price}
                      </span>
                    </td>
                    <td width="10%" className="text-center">
                      <div className="qty-control position-relative">
                        <input
                          type="number"
                          name="quantity"
                          value={item.Quantity}
                          min={1}
                          onChange={(e) => handleQuantityChangeDebounced(item.CartItemID, item.ProductID, item.ColorID, item.SizeID, parseInt(e.target.value))}
                          className="qty-control__number text-center"
                        />
                        <div
                          onClick={() => handleQuantityChangeDebounced(item.CartItemID, item.ProductID, item.ColorID, item.SizeID, item.Quantity - 1)}
                          className="qty-control__reduce"
                        >
                          -
                        </div>
                        <div
                          onClick={() => handleQuantityChangeDebounced(item.CartItemID, item.ProductID, item.ColorID, item.SizeID, item.Quantity + 1)}
                          className="qty-control__increase"
                        >
                          +
                        </div>
                      </div>
                    </td>
                    <td width="20%" className="text-center">
                      <span className="shopping-cart__subtotal">
                        ${ (item.Quantity * item.Price).toFixed(2) }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-table-footer d-flex justify-content-between align-items-center mt-4">
              <div className="d-flex gap-3">
                <button
                  className="btn btn-dark"
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
          </>
        ) : (
          <>
            <div className="fs-20">Shop cart is empty</div>
            <button className="btn mt-3 btn-light">
              <Link to={"/shop"}>Explore Products</Link>
            </button>
          </>
        )}
      </div>
      {/* Phần Cart Totals */}
      <div className="shopping-cart__totals-wrapper">
        <div className="sticky-content">
          <div className="shopping-cart__totals">
            <h3>Cart Totals</h3>
            <table className="cart-totals">
              <tbody>
                <tr>
                  <th>Total</th>
                  <td>
                    ${ cartProducts.reduce((total, item) => total + (item.Quantity * item.Price), 0).toFixed(2) }
                  </td>
                </tr>
              </tbody>
            </table>
            <Link
              to="/shop_checkout"
              className="btn btn-primary w-100 mt-3 mb-3"
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
    </div>
  );
}
