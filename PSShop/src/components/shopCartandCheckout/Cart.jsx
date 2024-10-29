import { useContextElement } from "../../context/Context";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCheckout } from '../../context/CheckoutContext';

export default function Cart() {
  const { cartProducts, setCartProducts, totalPrice, setTotalPrice } = useContextElement();
  const { updateOrderData } = useCheckout();
  
  const [checkboxes, setCheckboxes] = useState({
    free_shipping: false,
    flat_rate: false,
    local_pickup: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      axios.get(`http://127.0.0.1:8000/api/cart-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then(response => {
        const cartData = response.data.data;

        if (Array.isArray(cartData)) {
          setCartProducts(cartData);
          setTotalPrice(calculateTotalPrice(cartData)); // Calculate the total price on load
        } else {
          console.error("Invalid cart data:", cartData);
        }
      })
      .catch(error => {
        console.error("API error:", error);
      });
    } else {
      console.log("User not logged in");
    }
  }, [setCartProducts,setTotalPrice]);
  
  useEffect(() => {
    if (cartProducts.length > 0) {
      updateOrderData({
        products: cartProducts.map(item => ({
          ProductID: item.ProductID,
          VariantID: item.VariantID,
          Quantity: item.Quantity
        }))
      });
    }
  }, [cartProducts]);
  
  // Calculate total price
  const calculateTotalPrice = (products) => {
    return products.reduce((total, product) => {
      const productPrice = product.Price || 0;
      const productQuantity = product.Quantity || 0;
      return total + productPrice * productQuantity;
    }, 0);
  };

  // Update quantity
  const setQuantity = (id, quantity) => {
    if (quantity >= 1) {
      const updatedItems = cartProducts.map((item) =>
        item.id === id ? { ...item, Quantity: quantity } : item
      );
      setCartProducts(updatedItems);
      setTotalPrice(calculateTotalPrice(updatedItems)); // Update total price
    }
  };

  // Remove item
  const removeItem = (id) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      axios.delete(`http://127.0.0.1:8000/api/cart-items/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Update local state after successful deletion from backend
        const updatedCart = cartProducts.filter((item) => item.id !== id);
        setCartProducts(updatedCart);
        setTotalPrice(calculateTotalPrice(updatedCart)); // Update total price after removal
      })
      .catch(error => {
        console.error("Error removing item:", error);
      });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [id]: checked,
    }));
  };

  return (
    <div className="shopping-cart" style={{ minHeight: "calc(100vh - 300px)" }}>
      <div className="cart-table__wrapper">
        {cartProducts.length ? (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th></th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div className="shopping-cart__product-item">
                        <img
                          loading="lazy"
                          src={item.MainImageURL}
                          width="120"
                          height="120"
                          alt="image"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="shopping-cart__product-item__detail">
                        <h4>{item.title}</h4>
                        <ul className="shopping-cart__product-item__options">
                          <li>Color: {item.color}</li>
                          <li>Size: {item.size}</li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__product-price">
                        ${item.Price}
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
                            setQuantity(item.id, e.target.value / 1)
                          }
                          className="qty-control__number text-center"
                        />
                        <div
                          onClick={() => setQuantity(item.id, item.Quantity - 1)}
                          className="qty-control__reduce"
                        >
                          -
                        </div>
                        <div
                          onClick={() => setQuantity(item.id, item.Quantity + 1)}
                          className="qty-control__increase"
                        >
                          +
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__subtotal">
                        ${item.Price * item.Quantity}
                      </span>
                    </td>
                    <td>
                      <a
                        onClick={() => removeItem(item.id)}
                        className="remove-cart"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="#767676"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0.259435 8.85506L9.11449 0L10 0.885506L1.14494 9.74056L0.259435 8.85506Z" />
                          <path d="M0.885506 0.0889838L9.74057 8.94404L8.85506 9.82955L0 0.97449L0.885506 0.0889838Z" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}  
              </tbody>
            </table>
            <div className="cart-table-footer">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="position-relative bg-body"
              >
                <input
                  className="form-control"
                  type="text"
                  name="coupon_code"
                  placeholder="Coupon Code"
                />
                <input
                  className="btn-link fw-medium position-absolute top-0 end-0 h-100 px-4"
                  type="submit"
                  defaultValue="APPLY COUPON"
                />
              </form>
              <button className="btn btn-light">UPDATE CART</button>
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
      {cartProducts.length ? (
        <div className="shopping-cart__totals-wrapper">
          <div className="sticky-content">
            <div className="shopping-cart__totals">
              <h3>Cart Totals</h3>
              <table className="cart-totals">
                <tbody>
                  <tr>
                    <th>Subtotal</th>
                    <td>${totalPrice}</td>
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
                      <div>Shipping to AL.</div>
                      <div>
                        <a href="#" className="menu-link menu-link_us-s">
                          CHANGE ADDRESS
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>VAT</th>
                    <td>$19</td>
                  </tr>
                  <tr>
                    <th>Total</th>
                    <td>
                      $$
                      {totalPrice + (checkboxes.flat_rate ? 49 : 0) + (checkboxes.local_pickup ? 8 : 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Link 
                to="/shop_checkout" 
                className="btn btn-primary"
                onClick={(e) => {
                  if (cartProducts.length === 0) {
                    e.preventDefault();
                    alert('Giỏ hàng trống!');
                  }
                }}
              >
                PROCEED TO CHECKOUT
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
