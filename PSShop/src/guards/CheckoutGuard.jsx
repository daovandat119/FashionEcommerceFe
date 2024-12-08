import { useNavigate } from "react-router-dom";


const CheckoutGuard = ({ children }) => {
  // Kiểm tra xem người dùng đến từ trang shop_cart hay không
  const previousPage = document.referrer;
  const isFromCart = previousPage.includes('shop_cart');
  const navigate = useNavigate()
  if (!isFromCart) {
    return navigate('/shop_cart')
  }

  return children;
};

export default CheckoutGuard; 