import { Card, Typography } from "@material-tailwind/react";
// import UserList from "./users/UserList";
import Dashboard from "./dashboard/Dashboards";
import ProductsManager from "./products/ProductsManager";
import CategoryManager from "./categories/CategoryManager";
import Login from "./login/LoginAdmin";
import UsersManager from "./users/UsersManager";
import OrderList from "./oder/OderList";
import VoucherList from "./voucher/VoucherList";
import StatisticalUsers from "./statistical/StatisticalUsers";
import StatisticalProducts from "./statistical/StatisticalProducts";
import ProductDetailAdmin from "./products/ProductDetailAdmin";
const Admin = () => {
  return (
    <Card>
      <Login />
      <Dashboard />
      <ProductsManager />
      <CategoryManager />
      <UsersManager />
      <OrderList />
      <VoucherList />
      <StatisticalUsers />
      <StatisticalProducts />
      <ProductDetailAdmin />
    </Card>
  );
};

export default Admin;
