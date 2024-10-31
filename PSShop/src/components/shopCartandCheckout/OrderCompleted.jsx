import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useContextElement } from "../../context/Context";

export default function OrderCompleted() {
  const { orderId } = useParams(); 
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const { cartProducts } = useContextElement();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Không tìm thấy mã đơn hàng");
        return;
      }
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/order/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.data.data || response.data.data.length === 0) {
          setError("Không tìm thấy thông tin đơn hàng");
          return;
        }
        setOrderDetails(response.data.data[0]);
      } catch (err) {
        console.error("Chi tiết lỗi API:", err);
        setError("Không thể tải thông tin đơn hàng");
      }
    };

    fetchOrderDetails();
  }, [orderId, token]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-complete">
      <div className="order-complete__message">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="40" cy="40" r="40" fill="#B9A16B" />
          <path
            d="M52.9743 35.7612C52.9743 35.3426 52.8069 34.9241 52.5056 34.6228L50.2288 32.346C49.9275 32.0446 49.5089 31.8772 49.0904 31.8772C48.6719 31.8772 48.2533 32.0446 47.952 32.346L36.9699 43.3449L32.048 38.4062C31.7467 38.1049 31.3281 37.9375 30.9096 37.9375C30.4911 37.9375 30.0725 38.1049 29.7712 38.4062L27.4944 40.683C27.1931 40.9844 27.0257 41.4029 27.0257 41.8214C27.0257 42.24 27.1931 42.6585 27.4944 42.9598L33.5547 49.0201L35.8315 51.2969C36.1328 51.5982 36.5513 51.7656 36.9699 51.7656C37.3884 51.7656 37.8069 51.5982 38.1083 51.2969L40.385 49.0201L52.5056 36.8996C52.8069 36.5982 52.9743 36.1797 52.9743 35.7612Z"
            fill="white"
          />
        </svg>
        <h3>Your order is completed!</h3>
        <p>Thank you. Your order has been received.</p>
      </div>
      <div className="order-info">
        <div className="order-info__item">
          <label>Order Number</label>
          <span>#{orderDetails.OrderID}</span>
        </div>
        <div className="order-info__item">
          <label>Date</label>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="order-info__item">
          <label>Total</label>
          <span>${orderDetails.TotalPrice}</span>{" "}
        </div>
        <div className="order-info__item">
          <label>Paymetn Method</label>
          <span>Direct Bank Transfer</span>
        </div>
      </div>
      <div className="checkout__totals-wrapper">
        <div className="checkout__totals">
          <h3>Order Details</h3>
          <table className="checkout-cart-items">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {cartProducts.map((elm, i) => (
                <tr key={i}>
                  <td>
                    <h4>
                      {elm.ProductName} - {elm.ColorName} - {elm.SizeName} x{" "}
                      {elm.Quantity}
                    </h4>
                    <img
                      src={elm.MainImageURL}
                      alt={elm.ProductName}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>${elm.Price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="checkout-totals">
            <tbody>
              <tr>
                <th>SUBTOTAL</th>
                <td>${orderDetails.TotalPrice}</td>
              </tr>
              <tr>
                <th>SHIPPING</th>
                <td>Free shipping</td>
              </tr>
              <tr>
                <th>VAT</th>
                <td>${(19).toFixed(2)}</td>
              </tr>
              <tr>
                <th>TOTAL</th>
                <td>${orderDetails.TotalPrice + 19}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
