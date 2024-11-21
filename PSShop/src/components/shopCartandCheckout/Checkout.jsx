/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useCheckout } from "../../context/CheckoutContext";
import { useNavigate } from "react-router-dom";
import { useContextElement } from "../../context/Context";
import Swal from "sweetalert2";
import shipCodLogo from "../../assets/shipcodlogo.png";
import vnPayLogo from "../../assets/logovnpay.png";

export default function Checkout() {
  const { orderData, updateOrderData } = useCheckout();
  const { setTotalPrice, totalPrice } = useContextElement();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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
      logo: shipCodLogo
    },
    {
      id: 2,
      name: "Thanh toán qua VNPAY",
      description: "Thanh toán trực tuyến qua VNPAY",
      logo: vnPayLogo
    },
  ];

  const handlePaymentMethodSelect = (methodId) => {
    updateOrderData({ PaymentMethodID: parseInt(methodId) });
  };

  useEffect(() => {
    // Kiểm tra nếu giỏ hàng rỗng
    if (cartItems.length === 0) {
      navigate("/shop_cart"); // Điều hướng về trang giỏ hàng
      return; // Dừng render component
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [addressesResponse, cartItemsResponse, couponResponse] =
          await Promise.all([
            axios.get("http://127.0.0.1:8000/api/address", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://127.0.0.1:8000/api/cart-items", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.post(
              "http://127.0.0.1:8000/api/coupons/checkCoupon",
              { MinimumOrderValue: totalPrice.toFixed(2) },
              { headers: { Authorization: `Bearer ${token}` } }
            ),
          ]);

        setAddresses(addressesResponse.data.data);
        setCartItems(cartItemsResponse.data.data || []);
        setCoupons(couponResponse.data.data || []);

        if (String(addressesResponse.data.data.length) !== "0") {
          const shippingResponse = await axios.post(
            "http://127.0.0.1:8000/api/address/shipping-fee",
            null,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setShippingFee(shippingResponse.data.data.total);
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
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAllData();
    }
  }, [token, totalPrice]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!cartItems.length) {
      setError("Giỏ hàng trống");
      return;
    }

    const total = totalPrice + shippingFee;

    const orderPayload = {
      CouponID: appliedCoupon,
      PaymentMethodID: orderData.PaymentMethodID,
      TotalAmount: total,
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

      if (response.data.message && response.data.message.includes("Bạn đã hủy quá 3 lần.Vui lòng thanh toán chuyển khoản để tiếp tục.")) {
        Swal.fire({
          title: "Bạn đã hủy đơn hàng quá 3 lần vui lòng thanh toán chuyển khoản để tiếp tục",
          text: response.data.message,
          icon: "warning",
          confirmButtonText: "Đồng ý"
        });
        return;
      }

      if (response.data.status === "success") {
        setCartItems([]);
        navigate(`/shop_order_complete/${response.data.data.OrderID}`);
      } else if (response.data.vnpay_url) {
        window.location.href = response.data.vnpay_url;
      } else {
        setError("Đặt hàng thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Chi tiết lỗi:", err);
      setError("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
              <h1 className="text-lg font-semibold text-gray-900 mb-4">
                Địa Chỉ Giao Hàng
              </h1>
              {addresses.find((address) => address.IsDefault === 1) ? (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h1 className="text-gray-900">
                    {addresses.find((address) => address.IsDefault === 1).Address}
                  </h1>
                  <div className="mt-4">
                    <button
                      onClick={() => navigate("/account_edit_address")}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Phương Thức Thanh Toán
              </h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                    className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                      orderData.PaymentMethodID === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={method.logo}
                          alt={method.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {method.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {method.description}
                          </div>
                        </div>
                      </div>
                      {orderData.PaymentMethodID === method.id && (
                        <div className="text-blue-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mã Giảm Giá
              </h3>
              {coupons && coupons.length > 0 ? (
                <select
                  value={appliedCoupon}
                  onChange={(e) => {
                    const selectedCoupon = coupons.find(
                      (coupon) => coupon.CouponID === parseInt(e.target.value)
                    );
                    setAppliedCoupon(e.target.value);
                    if (selectedCoupon && selectedCoupon.usable) {
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
                    <option 
                      key={coupon.CouponID} 
                      value={coupon.CouponID}
                      disabled={coupon.usable === false}
                      className={coupon.usable === false ? 'text-gray-400' : ''}
                    >
                      {coupon.Name} - Giảm {coupon.DiscountPercentage}%
                      {coupon.MinimumOrderValue ? 
                        ` (Đơn tối thiểu ${Number(coupon.MinimumOrderValue).toLocaleString()}VND)` 
                        : ''
                      }
                      {!coupon.usable ? ' - Chưa đủ điều kiện' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <p>Không có mã giảm giá nào khả dụng.</p>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tổng Quan Đơn Hàng
                </h3>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 pb-4 border-b border-gray-100"
                    >
                      <img
                        src={item.ImageUrl}
                        alt={item.ProductName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-grow">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.ProductName}
                        </h4>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.ColorName} • {item.SizeName} • x
                          {item.Quantity}
                        </div>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          {(item.Price * item.Quantity).toFixed(2)}VND
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng Tiền</span>
                    <span className="font-medium">
                      {Number(totalPrice).toLocaleString()}VND
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">{Number(shippingFee).toLocaleString()}VND</span>
                  </div>
                  {discount > 0 && appliedCoupon && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Giảm giá</span>
                      <span>-{Number(discount).toLocaleString()}VND</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">
                        Thanh toán
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {Number(totalPrice + shippingFee - discount).toLocaleString()}VND
                      </span>
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
