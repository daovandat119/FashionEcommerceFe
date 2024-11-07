import { useContextElement } from "../../context/Context";
import { Link } from "react-router-dom";
import { useEffect } from "react";

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

  useEffect(() => {
    fetchCartItems(); // Fetch dữ liệu khi component mount
  }, [fetchCartItems]);

  useEffect(() => {
    fetchCartItems(); // Fetch dữ liệu khi component mount
  }, [fetchCartItems]);

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
                  Delete selected products ({selectedItems.length})
                </button>
              </div>
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
                    <th>Shipping</th>
                    <td>
                      <div className="form-check">
                        <input
                          className="form-check-input form-check-input_fill"
                          type="checkbox"
                          id="free_shipping"
                          checked={checkboxes.free_shipping}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="free_shipping"
                        >
                          Free shipping
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input form-check-input_fill"
                          type="checkbox"
                          id="flat_rate"
                          checked={checkboxes.flat_rate}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="flat_rate">
                          Flat rate: $49
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input form-check-input_fill"
                          type="checkbox"
                          id="local_pickup"
                          checked={checkboxes.local_pickup}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="local_pickup"
                        >
                          Local pickup: $8
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Total</th>
                    <td>
                      $
                      {formatPrice(
                        parseFloat(totalPrice) +
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
