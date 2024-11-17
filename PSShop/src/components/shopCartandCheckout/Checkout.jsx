import { useEffect, useState } from "react";
import axios from "axios";
import { useCheckout } from "../../context/CheckoutContext";
import { useNavigate } from "react-router-dom";
import { useContextElement } from "../../context/Context";
import Swal from "sweetalert2";

export default function Checkout() {
  const { orderData, updateOrderData } = useCheckout();
  const { setTotalPrice, totalPrice } = useContextElement();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingCartItems, setLoadingCartItems] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const token = localStorage.getItem("token");
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    if (!orderData.PaymentMethodID) {
      updateOrderData({ PaymentMethodID: 2 });
    }
  }, [orderData.PaymentMethodID, updateOrderData]);

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

  const handlePaymentMethodSelect = (methodId) => {
    updateOrderData({ PaymentMethodID: parseInt(methodId) });
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/address", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(response.data.data);
      } catch (error) {
        setError("Không thể tải địa chỉ");
        console.error(error);
      } finally {
        setLoadingAddresses(false);
      }
    };

    const fetchCartItems = async () => {
      setLoadingCartItems(true);
      if (!token) {
        setError("Vui lòng đăng nhập để lấy thông tin giỏ hàng.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/cart-items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.data) {
          setCartItems(response.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi lấy cart items:", err);
        setError("Không thể lấy thông tin giỏ hàng");
      } finally {
        setLoadingCartItems(false);
      }
    };

    fetchAddresses();
    fetchCartItems();
  }, [token]);

  const checkAddressExists = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/address/checkAddress", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (String(response.data.data) === "true") {
        await fetchShippingFee();
      } else {
        Swal.fire({
          title: "Thông báo",
          text: "Không có địa chỉ nào",
          icon: "warning",
          timer: 10000,
        });
        navigate("/account_edit_address");
      }
    } catch (error) {
      setError("Không thể kiểm tra địa chỉ");
      console.error(error);
    }
  };

  const fetchShippingFee = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/address/shipping-fee", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.data) {
        setShippingFee(response.data.data.total);
      }
    } catch (error) {
      setError("Không thể kiểm tra phí vận chuyển");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAddressesAndShippingFee = async () => {
      await checkAddressExists();
      await fetchShippingFee();
    };

    fetchAddressesAndShippingFee();
  }, [totalPrice]);

  const fetchCoupon = async () => {
    setLoadingCoupons(true);
    if (!token) {
      setError("Vui lòng đăng nhập để áp dụng mã giảm giá.");
      return;
    }

    const totalAmount = totalPrice + shippingFee;

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/coupons/checkCoupon", { MinimumOrderValue: totalAmount.toFixed(2) }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const couponData = response.data.data;
      setCoupons(couponData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCoupons(false);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, [totalPrice]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!cartItems.length) {
      setError("Giỏ hàng trống");
      return;
    }

    const total = totalPrice + shippingFee;

    const orderPayload = {
      PaymentMethodID: orderData.PaymentMethodID,
      TotalAmount: total,
    };

 

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/order", orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        setCartItems([]);
        Swal.fire({
          title: "Thông báo",
          text: "Đặt hàng thành công",
          icon: "success",
          timer: 5000,
        });
        navigate("/");
      } else if (response.data.vnpay_url) {
        window.open(response.data.vnpay_url, "_blank");

      } else {
        setError("Đặt hàng thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Chi tiết lỗi:", err);
      setError("Đặt hàng thất bại. Vui lòng thử lại.");
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
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-lg font-semibold text-gray-900 mb-4">Địa Chỉ Giao Hàng</h1>
              {loadingAddresses ? (
                <p>Đang tải địa chỉ...</p>
              ) : addresses.find(address => address.IsDefault === 1) ? (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h1 className="text-gray-900">{addresses.find(address => address.IsDefault === 1).Address}</h1>
                  <div className="mt-4">
                    <button
                      onClick={() => navigate('/account_edit_address')}
                      className="text-gray-600 hover:text-blue-800 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      Thay đổi địa chỉ
                    </button>
                  </div>
                </div>
              ) : (
                <p>Không có địa chỉ nào.</p>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phương Thức Thanh Toán</h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label key={method.id} className={`block p-4 border rounded-lg cursor-pointer transition-all ${orderData.PaymentMethodID === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
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
                        <div className="text-sm text-gray-500 mt-1">{method.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mã Giảm Giá</h3>
              {loadingCoupons ? (
                <p>Đang tải mã giảm giá...</p>
              ) : (
                <select
                  value={appliedCoupon}
                  onChange={(e) => {
                    const selectedCoupon = coupons.find(coupon => coupon.Code === e.target.value);
                    setAppliedCoupon(e.target.value);
                    if (selectedCoupon) {
                      const discountAmount = (totalPrice * selectedCoupon.DiscountPercentage) / 100;
                      setDiscount(discountAmount);
                    } else {
                      setDiscount(0);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                >
                  <option value="">Chọn mã giảm giá</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.Code} value={coupon.Code}>
                      {coupon.Name} - {coupon.DiscountPercentage}%
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng Quan Đơn Hàng</h3>
                <div className="space-y-4 mb-6">
                  {loadingCartItems ? (
                    <p>Đang tải giỏ hàng...</p>
                  ) : cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100">
                      <img src={item.ImageUrl} alt={item.ProductName} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-grow">
                        <h4 className="text-sm font-medium text-gray-900">{item.ProductName}</h4>
                        <div className="text-sm text-gray-500 mt-1">{item.ColorName} • {item.SizeName} • x{item.Quantity}</div>
                        <div className="text-sm font-medium text-gray-900 mt-1">${(item.Price * item.Quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng Tiền</span>
                    <span className="font-medium">${Number(totalPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">${shippingFee}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="font-medium">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">Thanh toán</span>
                      <span className="text-base font-semibold text-gray-600">${(totalPrice + shippingFee - discount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gray-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>Đặt Hàng</span>
                  <span className="text-sm">${(totalPrice + 19 - discount).toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}