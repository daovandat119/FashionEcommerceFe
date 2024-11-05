import { useEffect, useState } from "react";
import axios from "axios";
import { useCheckout } from "../../context/CheckoutContext";
import { useNavigate } from "react-router-dom";
import { useContextElement } from "../../context/Context";

export default function Checkout() {
  const { orderData, updateOrderData } = useCheckout();
  const { setTotalPrice, totalPrice } = useContextElement();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const paymentMethods = [
    {
      id: 1,
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán tiền mặt khi nhận hàng",
    },
    {
      id: 2,
      name: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản qua tài khoản ngân hàng",
    },
  ];

  // Xử lý chọn phương thức thanh toán
  const handlePaymentMethodSelect = (methodId) => {
    updateOrderData({ PaymentMethodID: parseInt(methodId) });
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/address", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(response.data.data);
      } catch (err) {
        setError("Không thể tải địa chỉ");
      }
    };
    fetchAddresses();
  }, [token]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/cart-items",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.data) {
          setCartItems(response.data.data);
        }

        console.log("Cart Items:", response.data.data);
      } catch (err) {
        console.error("Lỗi khi lấy cart items:", err);
        setError("Không thể lấy thông tin giỏ hàng");
      }
    };

    if (token) {
      fetchCartItems();
    }
  }, [token]);

  const handleAddressSelect = (addressId) => {
    updateOrderData({ AddressID: addressId });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!orderData.AddressID) {
      setError("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    if (!cartItems.length) {
      setError("Giỏ hàng trống");
      return;
    }

    // Tính tổng tiền (bao gồm cả VAT)
    const total = totalPrice + 19;

    const orderPayload = {
      AddressID: parseInt(orderData.AddressID),
      PaymentMethodID: 1,
      TotalAmount: total, // Thêm TotalAmount vào payload
      products: cartItems.map((item) => ({
        ProductID: item.ProductID,
        VariantID: item.VariantID,
        Quantity: item.Quantity,
      })),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/order",
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (
        response.data.message ===
        "Order created successfully, waiting for delivery."
      ) {
        // Reset state local
        setCartItems([]);
        if (typeof setTotalPrice === "function") {
          setTotalPrice(0);
        }

        // Lấy danh sách đơn hàng để get order mới nhất
        const ordersResponse = await axios.get(
          "http://127.0.0.1:8000/api/order",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (ordersResponse.data.data && ordersResponse.data.data.length > 0) {
          // Lấy order mới nhất (phần tử cuối cùng trong mảng)
          const latestOrder =
            ordersResponse.data.data[ordersResponse.data.data.length - 1];
          updateOrderData({
            OrderID: latestOrder.OrderID,
            orderCode: latestOrder.OrderCode,
          });

          // Chuyển hướng đến trang chi tiết đơn hàng
          navigate(`/shop_order_complete/${latestOrder.OrderID}`);
        } else {
          setError("Không thể lấy thông tin đơn hàng");
        }
      }
    } catch (err) {
      console.error("Chi tiết payload:", orderPayload);
      console.error("Chi tiết lỗi:", err);
      if (err.response?.data?.errors) {
        console.error("Validation errors:", err.response.data.errors);
      }
      setError(
        err.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <div className="checkout-page">
      {error && <div className="error-message text-red-500 mb-4">{error}</div>}

      <div className="address-section p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">ADDRESS</h3>

        <select
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:outline-none"
          value={orderData.AddressID || ""}
          onChange={(e) => handleAddressSelect(e.target.value)}
        >
          <option value="">-- ADDRESS --</option>
          {addresses.map((address) => (
            <option key={address.AddressID} value={address.AddressID}>
              {address.Username} | {address.PhoneNumber} | {address.Address}
            </option>
          ))}
        </select>

        <div className="payment-section mt-6 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            PHƯƠNG THỨC THANH TOÁN
          </h3>
          <div className="payment-methods space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  orderData.PaymentMethodID === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handlePaymentMethodSelect(method.id)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={`payment-${method.id}`}
                    name="payment-method"
                    value={method.id}
                    checked={orderData.PaymentMethodID === method.id}
                    onChange={() => handlePaymentMethodSelect(method.id)}
                    className="mr-3"
                  />
                  <div>
                    <label
                      htmlFor={`payment-${method.id}`}
                      className="font-medium text-gray-700 cursor-pointer"
                    >
                      {method.name}
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      {method.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Order Summary section */}
        <div className="order-summary mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Your Order
          </h3>
          <div className="products-list space-y-3">
            {cartItems.map((item) => (
              <div
                key={`product-${item.ProductID}`}
                className="product-item flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">
                  {item.ProductName} - {item.ColorName} - {item.SizeName} x{" "}
                  {item.Quantity}
                </span>
                <span className="font-medium">
                  ${(item.Price * item.Quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="totals mt-4 space-y-2">
            <div className="subtotal flex justify-between text-gray-600">
              <span>SUBTOTAL</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="vat flex justify-between text-gray-600">
              <span>VAT:</span>
              <span>${(19).toFixed(2)}</span>
            </div>
            <div className="total flex justify-between text-lg font-semibold mt-4 pt-2 border-t">
              <span>TOTAL</span>
              <span>${(totalPrice + 19).toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-info mt-4 pb-4 border-b border-gray-200">
            <p className="text-gray-600">
              Phương thức thanh toán:{" "}
              <span className="font-medium">
                {paymentMethods.find((m) => m.id === orderData.PaymentMethodID)
                  ?.name || "Chưa chọn"}
              </span>
            </p>
          </div>
          <button
            onClick={handlePlaceOrder}
            type="submit"
            className="w-full bg-gray-800 text-white p-4 rounded-md hover:bg-gray-900 mt-6 
                       transition-colors duration-200 font-medium text-lg"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
}
