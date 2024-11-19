/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useCheckout } from "../../context/CheckoutContext";
import { useNavigate } from "react-router-dom";
import { useContextElement } from "../../context/Context";
import Swal from "sweetalert2";
import shipcodlogo from '../../assets/shipcodlogo.png';
import logovnpay from '../../assets/logovnpay.png';

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
  const [couponError, setCouponError] = useState("");
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [canceledOrderCount, setCanceledOrderCount] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán tiền mặt khi nhận hàng",
      image: shipcodlogo
    },
    {
      id: 2,
      name: "Thanh toán qua VNPAY",
      description: "Thanh toán trực tuyến qua VNPAY",
      image: logovnpay
    }
  ]);

  useEffect(() => {
    if (!orderData.PaymentMethodID) {
      updateOrderData({ PaymentMethodID: 2 });
    }
  }, [orderData.PaymentMethodID, updateOrderData]);

  useEffect(() => {
    const checkCanceledOrders = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/order/views",
          { OrderStatusID: 4 }, // 4 là trạng thái đã hủy
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        // Đếm số đơn hàng đã hủy trong tháng hiện tại
        const canceledOrders = response.data.data.filter(order => {
          const orderDate = new Date(order.OrderDate);
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          return orderDate >= oneMonthAgo;
        });
        
        setCanceledOrderCount(canceledOrders.length);
        
        // Nếu đã hủy quá 3 đơn, vô hiệu hóa COD
        if (canceledOrders.length > 3) {
          updateOrderData({ PaymentMethodID: 2 }); // Tự động chọn VNPAY
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra đơn hàng đã hủy:", error);
      }
    };

    checkCanceledOrders();
  }, [token]);

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
      setLoadingAddresses(true);
      setLoadingCartItems(true);
      setLoadingCoupons(true);

      try {
        const [addressesResponse, cartItemsResponse, couponResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/address", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/cart-items", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.post(
            "http://127.0.0.1:8000/api/coupons/checkCoupon", 
            { MinimumOrderValue: (totalPrice + shippingFee).toFixed(2) },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        setAddresses(addressesResponse.data.data);
        setCartItems(cartItemsResponse.data.data || []);
        setCoupons(couponResponse.data.data);
        
        // Kiểm tra và tải phí vận chuyển nếu có địa chỉ
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
        setLoadingAddresses(false);
        setLoadingCartItems(false);
        setLoadingCoupons(false);
      }
    };

    if (token) {
      fetchAllData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, totalPrice]);

  const handleCouponSelect = async (couponCode) => {
    try {
      if (!couponCode) {
        setAppliedCoupon("");
        setDiscount(0);
        setSelectedCouponId(null);
        return;
      }

      const selectedCoupon = coupons.find(coupon => coupon.Code === couponCode);
      
      // Kiểm tra số lượt sử dụng còn lại
      if (selectedCoupon.UsedCount >= selectedCoupon.UsageLimit) {
        setCouponError("Mã giảm giá đã hết lượt sử dụng");
        setAppliedCoupon("");
        setDiscount(0);
        setSelectedCouponId(null);
        return;
      }

      // Kiểm tra giá trị đơn hàng tối thiểu
      if (totalPrice < selectedCoupon.MinimumOrderValue) {
        setCouponError(`Đơn hàng cần tối thiểu ${selectedCoupon.MinimumOrderValue}VND để sử dụng mã này`);
        setAppliedCoupon("");
        setDiscount(0);
        setSelectedCouponId(null);
        return;
      }

      setAppliedCoupon(couponCode);
      setSelectedCouponId(selectedCoupon.CouponID);
      const discountAmount = (totalPrice * selectedCoupon.DiscountPercentage) / 100;
      setDiscount(discountAmount);
      setCouponError("");

    } catch (error) {
      console.error("Lỗi khi áp dụng mã giảm giá:", error);
      setAppliedCoupon("");
      setDiscount(0);
      setSelectedCouponId(null);
      setCouponError("Không thể áp dụng mã giảm giá");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (canceledOrderCount > 3 && orderData.PaymentMethodID === 1) {
        setError("Bạn đã hủy quá 3 đơn hàng trong tháng này. Vui lòng sử dụng thanh toán VNPAY.");
        return;
      }

      // 1. Kiểm tra giỏ hàng
      if (!cartItems.length) {
        setError("Giỏ hàng trống");
        return;
      }

      // 2. Kiểm tra địa chỉ
      const defaultAddress = addresses.find(addr => addr.IsDefault === 1);
      if (!defaultAddress) {
        setError("Vui lòng chọn địa chỉ giao hàng");
        return;
      }

      // 3. Kiểm tra giá trị đơn hàng
      const total = totalPrice + shippingFee - discount;
      if (total <= 0) {
        setError("Giá trị đơn hàng không hợp lệ");
        return;
      }

      // 4. Kiểm tra phương thức thanh toán
      if (!orderData.PaymentMethodID) {
        setError("Vui lòng chọn phương thức thanh toán");
        return;
      }

      // 5. Tạo payload sau khi đã kiểm tra
      const orderPayload = {
        PaymentMethodID: parseInt(orderData.PaymentMethodID),
        TotalAmount: parseFloat(total),
        ShippingFee: parseFloat(shippingFee),
        AddressID: parseInt(defaultAddress.AddressID),
        ...(selectedCouponId && { CouponID: parseInt(selectedCouponId) })
      };

      // 6. Kiểm tra lại payload trước khi gửi
      if (!orderPayload.PaymentMethodID || !orderPayload.AddressID || !orderPayload.TotalAmount) {
        setError("Thông tin đơn hàng không đầy đủ");
        return;
      }

      console.log("Order Payload:", orderPayload);

      const orderResponse = await axios.post(
        "http://127.0.0.1:8000/api/order",
        orderPayload,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // 7. Kiểm tra response trước khi xử lý
      if (!orderResponse.data) {
        setError("Không nhận được phản hồi từ server");
        return;
      }

      if (orderResponse.data.status === "success") {
        setCartItems([]);
        if (orderData.PaymentMethodID === 2) {
          window.location.href = orderResponse.data.data;
        } else {
          navigate(`/order_completed/${orderResponse.data.data}`);
        }
      } else {
        setError(orderResponse.data.message || "Đặt hàng thất bại. Vui lòng thử lại.");
        return; // Dừng xử lý nếu có lỗi
      }
    } catch (err) {
      console.error("Chi tiết lỗi:", err);
      if (err.response?.data?.message) {
        setError(`Đặt hàng thất bại: ${err.response.data.message}`);
      } else {
        setError("Đặt hàng thất bại. Vui lòng thử lại sau.");
      }
      return; // Dừng xử lý khi có lỗi
    }
  };

  const renderPaymentMethods = () => {
    return (
      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const isDisabled = method.id === 1 && canceledOrderCount > 3;
          
          return (
            <div key={method.id} className={`relative ${isDisabled ? 'opacity-50' : ''}`}>
              <input
                type="radio"
                name="payment-method"
                id={`payment-${method.id}`}
                value={method.id}
                checked={orderData.PaymentMethodID === method.id}
                onChange={() => handlePaymentMethodSelect(method.id)}
                disabled={isDisabled}
                className="hidden"
              />
              <label
                htmlFor={`payment-${method.id}`}
                className={`block p-4 border rounded-lg 
                  ${orderData.PaymentMethodID === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-blue-300'}`}
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={method.image} 
                    alt={method.name}
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{method.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{method.description}</div>
                    {isDisabled && (
                      <div className="text-sm text-red-500 mt-1">
                        Không khả dụng do bạn đã hủy quá 3 đơn hàng trong tháng này
                      </div>
                    )}
                  </div>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    );
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
              {renderPaymentMethods()}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mã Giảm Giá</h3>
              {loadingCoupons ? (
                <p>Đang tải mã giảm giá...</p>
              ) : (
                <>
                  <select
                    value={appliedCoupon}
                    onChange={(e) => handleCouponSelect(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                  >
                    <option value="">Chọn mã giảm giá</option>
                    {coupons.map((coupon) => (
                      <option 
                        key={coupon.CouponID} 
                        value={coupon.Code}
                        disabled={coupon.UsedCount >= coupon.UsageLimit}
                      >
                        {coupon.Name} - {coupon.DiscountPercentage}% 
                        {coupon.UsedCount >= coupon.UsageLimit 
                          ? " (Đã hết lượt sử dụng)"
                          : ` (Còn ${coupon.UsageLimit - coupon.UsedCount} lượt sử dụng)`
                        }
                      </option>
                    ))}
                  </select>
                  {couponError && (
                    <p className="text-red-500 text-sm mt-2">{couponError}</p>
                  )}
                  {appliedCoupon && !couponError && (
                    <p className="text-green-500 text-sm mt-2">
                      Đã áp dụng mã giảm giá thành công!
                    </p>
                  )}
                </>
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
                        <div className="text-sm font-medium text-gray-900 mt-1">{(item.Price * item.Quantity).toFixed(2)}VND</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng Tiền</span>
                    <span className="font-medium">{Number(totalPrice).toFixed(2)}VND</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">{shippingFee}VND</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="font-medium">-{discount.toFixed(2)}VND</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">Thanh toán</span>
                      <span className="text-base font-semibold text-gray-600">{(totalPrice + shippingFee - discount).toFixed(2)}VND</span>
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