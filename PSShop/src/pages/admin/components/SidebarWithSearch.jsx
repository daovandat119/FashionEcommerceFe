import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Input,
} from "@material-tailwind/react";
import {
  ChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  SwatchIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import logo from "../../../../public/assets/images/logo.png";


export function SidebarWithSearch() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <Card className="h-[100vh] w-full max-w-[20rem] p-4">
      <div className=" flex items-center justify-center ">
      <img className="w-20  " src={logo} alt="Logo" />
        <p className="text-2xl font-bold ">ADMIN</p>
      </div>
      <div className="p-2 mt-10">
        <Input
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          label="Search"
        />
      </div>
      <List>
        <Link to="/admin/dashboard">
          <ListItem>
            <ListItemPrefix>
              <ChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem>
        </Link>
        <Link to="/admin/products">
          <ListItem>
            <ListItemPrefix>
              <ShoppingBagIcon className="h-5 w-5" />
            </ListItemPrefix>
            Products
          </ListItem>
        </Link>
        <Link to="/admin/categories">
          <ListItem>
            <ListItemPrefix>
              <InboxIcon className="h-5 w-5" />
            </ListItemPrefix>
            Categories
          </ListItem>
        </Link>
        <Link to="/admin/colors">
          <ListItem>
            <ListItemPrefix>
              <SwatchIcon className="h-5 w-5" />
            </ListItemPrefix>
            Colors
          </ListItem>
        </Link>
        <Link to="/admin/sizes">
          <ListItem>
            <ListItemPrefix>
              <ArrowsPointingOutIcon className="h-5 w-5" />
            </ListItemPrefix>
            Sizes
          </ListItem>
        </Link>
        <Link to="/admin/users">
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Users
          </ListItem>
        </Link>
        <ListItem>
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>

        <ListItem className="mt-20" onClick={handleLogout}>
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5 " />
          </ListItemPrefix>
          Logout
        </ListItem>
      </List>
    </Card>
  );
}
