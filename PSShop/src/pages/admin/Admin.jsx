import { Card, Typography } from "@material-tailwind/react";
// import UserList from "./users/UserList";
import Dashboard from "./dashboard/Dashboards";
import ProductsManager from "./products/ProductsManager";
import CategoryManager from "./categories/CategoryManager";
import Login from "./login/LoginAdmin";
import UsersManager from "./users/UsersManager";
import CartList from "./cart/CartList";
const Admin = () => {
  return (
    <Card>
      <Login />
      <Dashboard />
      <ProductsManager />
      <CategoryManager />
      <UsersManager />
      <CartList />
    </Card>
  );
};

export default Admin;
