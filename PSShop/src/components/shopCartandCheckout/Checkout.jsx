import { useEffect, useState } from "react";
import axios from "axios";
import { useCheckout } from '../../context/CheckoutContext';
import { useNavigate } from 'react-router-dom';
import { useContextElement } from "../../context/Context";

export default function Checkout() {
  const { orderData, updateOrderData } = useCheckout();
  const { setTotalPrice, totalPrice } = useContextElement();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/address', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(response.data.data);
      } catch (err) {
        setError('Không thể tải địa chỉ');
      }
    };
    fetchAddresses();
  }, [token]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/cart-items', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.data) {
          setCartItems(response.data.data);
        }
        
        console.log('Cart Items:', response.data.data);
      } catch (err) {
        console.error('Lỗi khi lấy cart items:', err);
        setError('Không thể lấy thông tin giỏ hàng');
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
    setError('');

    if (!orderData.AddressID) {
      setError('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    if (!cartItems.length) {
      setError('Giỏ hàng trống');
      return;
    }

    const orderPayload = {
      AddressID: parseInt(orderData.AddressID),
      PaymentMethodID: 1,
      products: cartItems.map(item => ({
        ProductID: item.ProductID,
        VariantID: item.VariantID,
        Quantity: item.Quantity
      }))
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/order',
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    
      console.log('Response từ API đặt hàng:', response.data);
    
      if (response.data.data) {
        const orderId = response.data.data.OrderID;
        
        updateOrderData({ 
          orderCode: response.data.data.OrderCode,
          orderId: orderId
        });
        
        setCartItems([]);
        if (typeof setTotalPrice === 'function') {
          setTotalPrice(0);
        }
        
        // Sửa cách navigate
        navigate(`/shop_order_complete/${orderId}`);
      }
    } catch (err) {
      console.error('Chi tiết payload:', orderPayload);
      console.error('Chi tiết lỗi:', err);
      if (err.response?.data?.errors) {
        console.error('Validation errors:', err.response.data.errors);
      }
      setError(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="checkout-page">
      {error && <div className="error-message text-red-500 mb-4">{error}</div>}
      
      <div className="address-section p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">ADDRESS</h3>
        
        <select 
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:outline-none"
          value={orderData.AddressID || ''}
          onChange={(e) => handleAddressSelect(e.target.value)}
        >
          <option value="">-- ADDRESS --</option>
          {addresses.map(address => (
            <option key={address.AddressID} value={address.AddressID}>
              {address.Username} | {address.PhoneNumber} | {address.Address}
            </option>
          ))}
        </select>

        {/* Order Summary section */}
        <div className="order-summary mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Order</h3>
          <div className="products-list space-y-3">
            {cartItems.map(item => (
              <div 
                key={`product-${item.ProductID}`} 
                className="product-item flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">
                  {item.ProductName} - {item.ColorName} - {item.SizeName} x {item.Quantity}
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