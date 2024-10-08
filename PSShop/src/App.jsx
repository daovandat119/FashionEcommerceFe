import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePages from "./pages/homepages/HomePages";
//import HomePages1 from './pages/homepages/HomePage1';
import LoginPage from "./pages/login/LoginPage";
import "./styles/style.scss";
import Context from "./context/Context";
// import "rc-slider/assets/index.css";
// import "tippy.js/dist/tippy.css";
import AboutPage from "./pages/about";
import ShopPages1 from "./pages/shoplist/shoplist-1";
import ShopCartPage from "./pages/shop-cart-checkout/shop_cart";
import ShopCheckoutPage from "./pages/shop-cart-checkout/shop_checkout";
import ShopOrderConplate from "./pages/shop-cart-checkout/shop_order_complete";
import ShopOrderTrackingPage from "./pages/shop-cart-checkout/shop_order_tracking";
function App() {
  return (
    <Context>
      <Router>
        <Routes>
          <Route path="/" element={<HomePages />} />
          <Route path="shop" element={<ShopPages1 />} />
         
          <Route path="login_register" element={<LoginPage />} />
          <Route path="about" element={<AboutPage />} />

          <Route path="shop_cart" element={<ShopCartPage />} />
          <Route path="shop_checkout" element={<ShopCheckoutPage />} />
          <Route path="shop_order_complete" element={<ShopOrderConplate />} />

          <Route
            path="shop_order_tracking"
            element={<ShopOrderTrackingPage />}
          />
        </Routes>
      </Router>
    </Context>
  );
}

export default App;
