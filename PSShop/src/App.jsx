// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider,Button, Card, Input } from "@material-tailwind/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import * as MTR from "@material-tailwind/react";

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
import ColorList from "./pages/admin/color/ColorList";
import SizeList from "./pages/admin/sizes/SizeList";
import AddUsers from "./pages/admin/users/AddUsers";
import UpdateUsers from "./pages/admin/users/UpdateUsers";
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './guards/AuthGuard';
import AddColor from "./pages/admin/color/AddColor";
import { UpdateColor } from "./pages/admin/service/api_service";
import UpdateColorComponent from "./pages/admin/color/UpdateColor";
import AddSizeComponent from "./pages/admin/sizes/AddSize";
import UpdateSize from "./pages/admin/sizes/UpdateSize";
import { LoginProvider } from "./components/login/LoginContext";

function App() {
  return (
    <AuthProvider>
      <Context>
      <LoginProvider>
        <ThemeProvider>
          <Router>
            <ToastContainer />
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
              <Route path="/admin" element={
                <AuthGuard>
                  <AdminLayout />
                </AuthGuard>
              }>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ProductsList />} />
                <Route path="categories" element={<CategoriesList />} />
                <Route path="/admin/categories/add" element={<AddCategories />}/>
                <Route path="/admin/categories/edit/:CategoryID" element={<UpdateCategory />}/>
                <Route path="/admin/products/add" element={<AddProducts />}/>
                <Route path="/admin/products/edit/:ProductID" element={<UpdateProducts />} />
                <Route path="/admin/products/delete/:ProductID"/>
                <Route path="users" element={<UserList />} />
                <Route path="/admin/users/add-users" element={<AddUsers />}/>
                <Route path="/admin/users/edit-users/:id" element={<UpdateUsers/>}/>
                <Route path="/admin/users/delete-users/:id"/>
                <Route path="/admin/colors/" element={<ColorList />} />
                <Route path="/admin/colors/add" element={<AddColor />} />
                <Route path="/admin/colors/delete/:ColorID" />
                <Route path="/admin/colors/edit/:ColorID" element={<UpdateColorComponent />} />
                <Route path="/admin/sizes" element={<SizeList />} />
                <Route path="/admin/sizes/add" element={<AddSizeComponent />} />
                <Route path="/admin/sizes/edit/:SizeID" element={<UpdateSize />} />
                <Route path="/admin/sizes/delete/:SizeID" />
              </Route>
              
            </Routes>
          </Router>
        </ThemeProvider>
        </LoginProvider>
      </Context>
    </AuthProvider>
  );
}

export default App;
