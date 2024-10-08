import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePages from "./pages/homepages/HomePages";
//import HomePages1 from './pages/homepages/HomePage1';
import LoginPage from "./pages/login/LoginPage";
import "./styles/style.scss";
import Context from "./context/Context";
import "rc-slider/assets/index.css";
import "tippy.js/dist/tippy.css";
import './App.css'
import AboutPage from "./pages/about";
import ShopPages1 from "./pages/shoplist/shoplist-1";
import ShopCartPage from "./pages/shop-cart-checkout/shop_cart";
import ShopCheckoutPage from "./pages/shop-cart-checkout/shop_checkout";
import ShopOrderConplate from "./pages/shop-cart-checkout/shop_order_complete";
import ShopOrderTrackingPage from "./pages/shop-cart-checkout/shop_order_tracking";

import BlogPage1 from "./pages/blogs";
import ProductDetailsPage2 from "./components/products-detail/detail";

import ProductsList from "./pages/admin/ProductsList";
import ContactPage from "./pages/contact";


function App() {
  return (
    <Context>
      <Router>
        <Routes>
          <Route path="/" element={<HomePages />} />
          <Route path="shop" element={<ShopPages1 />} />
          <Route path="blogs" element={<BlogPage1 />} />
          <Route path="shop-detail/:id" element={<ProductDetailsPage2 />} />
          <Route path="login_register" element={<LoginPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />

          <Route path="shop_cart" element={<ShopCartPage />} />
          <Route path="shop_checkout" element={<ShopCheckoutPage />} />
          <Route path="shop_order_complete" element={<ShopOrderConplate />} />

          <Route
            path="shop_order_tracking"
            element={<ShopOrderTrackingPage />}
          />
        </Routes>

        <Routes path="/admin" element={<ProductsList/>}>
        <Route path="products-list" element={<ShopCartPage />} />
        </Routes>
      </Router>
    </Context>
  );
}

export default App;
