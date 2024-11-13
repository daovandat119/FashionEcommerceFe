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
      name: "Thanh toán qua VNPAY",
      description: "Thanh toán trực tuyến qua VNPAY",
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
      } catch (error) {
        setError("Không thể tải địa chỉ");
        console.error(error);
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

  const handlePayment = async () => {
    const totalAmount = totalPrice + 19; // Tính tổng tiền
    const userId = orderData.UserID || localStorage.getItem("userId"); // Lấy UserID từ orderData hoặc local storage

    // Kiểm tra xem userId có hợp lệ không
    if (!userId) {
      setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      navigate('/login'); // Điều hướng đến trang đăng nhập
      return;
    }

    try {
      // Gọi API thanh toán với tổng tiền và userId
      const response = await axios.get(`http://127.0.0.1:8000/pay/${totalAmount}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Chuyển hướng đến URL thanh toán VNPAY
      window.location.href = response.data.paymentUrl; // Giả sử API trả về paymentUrl
    } catch (error) {
      setError("Lỗi khi thanh toán. Vui lòng thử lại.");
      console.error(error);
    }
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
      PaymentMethodID: orderData.PaymentMethodID, // Sử dụng phương thức thanh toán đã chọn
      TotalAmount: total,
      products: cartItems.map((item) => ({
        ProductID: item.ProductID,
        VariantID: item.VariantID,
        Quantity: item.Quantity,
      })),
    };

    // Nếu phương thức thanh toán là VNPAY, gọi hàm handlePayment
    if (orderData.PaymentMethodID === 2) {
      handlePayment();
      return; // Ngừng thực hiện các bước tiếp theo
    }

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
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-2xl font-bold text-gray-900 mb-8">Checkout</div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột bên trái - Thông tin giao hàng và thanh toán */}
          <div className="lg:col-span-2 space-y-6">
            {/* Phần địa chỉ giao hàng */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Địa Chỉ Giao Hàng
              </h3>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                           focus:ring-blue-500 focus:border-blue-500"
                value={orderData.AddressID || ""}
                onChange={(e) => handleAddressSelect(e.target.value)}
              >
                <option value="">-- Chọn địa chỉ giao hàng --</option>
                {addresses.filter(address => address.IsDefault).map((address) => (
                  <option key={address.AddressID} value={address.AddressID}>
                    {address.UserName} | {address.PhoneNumber} | {address.Address}
                  </option>
                ))}
              </select>
              {orderData.AddressID && (
                <div className="mt-4">
                  <button
                    onClick={() => navigate('/account_edit_address')}
                    className="text-gray-600 hover:text-blue-800  transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Thay đổi địa chỉ
                  </button>
                </div>
              )}
            </div>
  
            {/* Phần phương thức thanh toán */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Phương Thức Thanh Toán
              </h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`
                      block p-4 border rounded-lg cursor-pointer transition-all
                      ${orderData.PaymentMethodID === method.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={orderData.PaymentMethodID === method.id}
                        onChange={() => handlePaymentMethodSelect(method.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {method.description}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
  
          {/* Cột bên phải - Tổng quan đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tổng Quan Đơn Hàng
                </h3>
  
                {/* Danh sách sản phẩm */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100">
                      <div className="flex-grow">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.ProductName}
                        </h4>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.ColorName} • {item.SizeName} • x{item.Quantity}
                        </div>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          ${(item.Price * item.Quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
  
                {/* Chi tiết thanh toán */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">$19.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (10%)</span>
                    <span className="font-medium">
                      ${(totalPrice * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">
                        Tổng cộng
                      </span>
                      <span className="text-base font-semibold text-gray-600">
                        ${(totalPrice + 19 + totalPrice * 0.1).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Nút đặt hàng */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handlePlaceOrder}
                  disabled={!orderData.AddressID || cartItems.length === 0}
                  className="w-full bg-gray-600 text-white py-4 px-6 rounded-lg font-medium
                             hover:bg-gray-700 transition-colors duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                >
                  <span>Đặt Hàng</span>
                  <span className="text-sm">
                    (${(totalPrice + 19 + totalPrice * 0.1).toFixed(2)})
                  </span>
                </button>
                {!orderData.AddressID && (
                  <p className="text-sm text-red-500 mt-2">
                    Vui lòng chọn địa chỉ giao hàng
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
