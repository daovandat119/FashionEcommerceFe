import { Card, Typography } from "@material-tailwind/react";
import UserList from "./users/UserList";
import Dashboard from "./dashboard/Dashboards";
import ProductsManager from "./products/ProductsManager";
import CategoryManager from "./categories/CategoryManager";
import Login from "./login/LoginAdmin";
const Admin = () => {
  return (
    <Card>
      <Typography variant="h4" color="blue-gray">
        ADMIN
      </Typography>
      <Login />
      <Dashboard />
      <ProductsManager />
      <CategoryManager />
      <UserList />
    </Card>
  );
};

export default Admin;
