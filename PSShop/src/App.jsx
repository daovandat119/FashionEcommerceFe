// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
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
import AuthGuard from './guards/AuthGuard';
import AddColor from "./pages/admin/color/AddColor";
import UpdateColorComponent from "./pages/admin/color/UpdateColor";
import AddSizeComponent from "./pages/admin/sizes/AddSize";
import UpdateSize from "./pages/admin/sizes/UpdateSize";
import { LoginProvider } from "./components/login/LoginContext";
import { AuthProvider } from './context/AuthContext';
import UpdateVariant from "./pages/admin/products/UpdateVariant";

// Account pages imports
import AccountPage from './pages/dashboard/account_dashboard';
import AccountOrderPage from "./pages/dashboard/account_orders";
import AccountEditAddressPage from './pages/dashboard/account_edit_address/index';
import AccountEditPage from "./pages/dashboard/account_edit";


function App() {
  return (
    <Router>
      <ToastContainer /> {/* Ensure ToastContainer is placed here */}
      <AppRoutes />
    </Router>
  );
}

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Save the current path to localStorage
    localStorage.setItem("currentPath", location.pathname);
  }, [location]);

  useEffect(() => {
    // Restore the path from localStorage on app start
    const savedPath = localStorage.getItem("currentPath");
    if (savedPath) {
      navigate(savedPath);
    }
  }, [navigate]);

  return (
    <AuthProvider>
      <Context>
        <ThemeProvider>
          <Routes>
            {/* Client routes */}
            <Route path="/" element={<HomePages />} />
            <Route path="shop" element={<ShopPages1 />} />
            <Route path="blogs" element={<BlogPage1 />} />
            <Route path="shop-detail/:id" element={<ProductDetailsPage2 />} />
            <Route path="login_register" element={<LoginProvider><LoginPage /></LoginProvider>} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="shop_cart" element={<ShopCartPage />} />
            <Route path="shop_checkout" element={<ShopCheckoutPage />} />
            <Route path="shop_order_complete" element={<ShopOrderConplate />} />
            <Route path="shop_order_tracking" element={<ShopOrderTrackingPage />} />

            {/* Account routes */}
            <Route path="account_dashboard" element={<AccountPage />} />

            <Route path="account_orders" element={<AccountOrderPage />} />         
            <Route path="account_edit_address" element={<AccountEditAddressPage />} />
            <Route path="account_edit" element={<AccountEditPage />} />

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
              <Route path="categories/add" element={<AddCategories />} />
              <Route path="categories/edit/:CategoryID" element={<UpdateCategory />} />
              <Route path="products/add" element={<AddProducts />} />
              <Route path="products/edit/:ProductID" element={<UpdateProducts />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/add-users" element={<AddUsers />} />
              <Route path="users/edit-users/:id" element={<UpdateUsers />} />
              <Route path="colors" element={<ColorList />} />
              <Route path="colors/add" element={<AddColor />} />
              <Route path="colors/edit/:ColorID" element={<UpdateColorComponent />} />
              <Route path="sizes" element={<SizeList />} />
              <Route path="sizes/add" element={<AddSizeComponent />} />
              <Route path="sizes/edit/:SizeID" element={<UpdateSize />} />
              <Route path="products/edit-variant/:VariantID" element={<UpdateVariant />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Context>
    </AuthProvider>
  );
};

export default App;
