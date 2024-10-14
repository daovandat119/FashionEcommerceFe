import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import HomePages from "./pages/homepages/HomePages";
import LoginPage from "./pages/login/LoginPage";
import "./styles/style.scss";
import Context from "./context/Context";
import "rc-slider/assets/index.css";
import "tippy.js/dist/tippy.css";
import AboutPage from "./pages/about";
import ShopPages1 from "./pages/shoplist/shoplist-1";
import ShopCartPage from "./pages/shop-cart-checkout/shop_cart";
import ShopCheckoutPage from "./pages/shop-cart-checkout/shop_checkout";
import ShopOrderConplate from "./pages/shop-cart-checkout/shop_order_complete";
import ShopOrderTrackingPage from "./pages/shop-cart-checkout/shop_order_tracking";
import BlogPage1 from "./pages/blogs";
import ProductDetailsPage2 from "./components/products-detail/detail";
import ContactPage from "./pages/contact";

// Admin imports
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/dashboard/Dashboards";
import ProductsList from "./pages/admin/products/ProductsList";
import CategoriesList from "./pages/admin/categories/CategoriesList";
import UserList from "./pages/admin/users/UserList";
import AddCategories from "./pages/admin/categories/AddCategories";
import UpdateCategory from "./pages/admin/categories/UpdateCategories";
import AddProducts from "./pages/admin/products/AddProducts";
import UpdateProducts from "./pages/admin/products/UpdateProducts";
import LoginAdmin from "./pages/admin/login/LoginAdmin";
function App() {
  return (
    <Context>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Client routes */}
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
            <Route path="shop_order_tracking" element={<ShopOrderTrackingPage />}/>

            {/* Admin routes */}
            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="categories" element={<CategoriesList />} />
              <Route path="/admin/categories/add" element={<AddCategories />}/>
              <Route path="/admin/categories/edit/:id" element={<UpdateCategory />}/>
              <Route path="/admin/products/add" element={<AddProducts />}/>
              <Route path="/admin/products/edit/:id" element={<UpdateProducts />}/>
              <Route path="/admin/products/delete/:id"/>
              <Route path="users" element={<UserList />} />
            </Route>
            
          </Routes>
        </Router>
      </ThemeProvider>
    </Context>
  );
}

export default App;
