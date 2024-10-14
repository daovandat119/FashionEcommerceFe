import React from "react";
import { Link } from "react-router-dom";
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
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export function SidebarWithSearch() {
  return (
    <Card className="h-[100vh] w-full max-w-[20rem] p-4  ">
      <div className="mb-2 flex items-center gap-4 p-4">
        <img src="https://docs.material-tailwind.com/img/logo-ct-dark.png" alt="brand" className="h-8 w-8" />
        <Typography variant="h5" color="blue-gray">
          Admin Panel
        </Typography>
      </div>
      <div className="p-2">
        <Input icon={<MagnifyingGlassIcon className="h-5 w-5" />} label="Search" />
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

        <Link to="/admin/login">
          <ListItem>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5 mt-3" />
            </ListItemPrefix>
           
          </ListItem>
        </Link>
      </List>
      
    </Card>
  );
}