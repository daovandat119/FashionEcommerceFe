import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import {
  ChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  SwatchIcon,
  ArrowsPointingOutIcon,
  CogIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  TicketIcon,
} from "@heroicons/react/24/solid";

import logo from "../../../../public/assets/images/logo.png";

export function SidebarWithSearch() {
 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Card className="h-[100vh] w-full max-w-[20rem] p-4 relative">
      <div className="flex items-center justify-center py-7 mr-5">
        <img className="w-20" src={logo} alt="Logo" />
        <p className="text-2xl font-bold">ADMIN</p>
      </div>

      <List>
        <Link
          to="/admin/dashboard"
          className="hover:bg-gray-200 transition-all duration-800 rounded-xl"
        >
          <ListItem>
            <ListItemPrefix>
              <ChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem>
        </Link>

        <ListItem
          onClick={toggleDropdown}
          className="hover:bg-gray-200 transition-all duration-800 rounded-xl"
        >
          <ListItemPrefix>
            <CogIcon className="h-5 w-5" />
          </ListItemPrefix>
          Management
          <ChevronRightIcon className="h-5 w-5 ml-10" />
        </ListItem>

        <div
          className={`ml-6 transition-all duration-800 ease-in-out ${
            isDropdownOpen
              ? "h-48 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          {isDropdownOpen && (
            <>
              <Link to="/admin/products">
                <ListItem
                  className={`hover:bg-gray-200 duration-800 rounded-xl transition-opacity duration-300 ${
                    isDropdownOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ListItemPrefix>
                    <ShoppingBagIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Products
                </ListItem>
              </Link>
              <Link to="/admin/categories">
                <ListItem
                  className={`hover:bg-gray-200 duration-800 rounded-xl  transition-opacity duration-300 ${
                    isDropdownOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ListItemPrefix>
                    <InboxIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Categories
                </ListItem>
              </Link>
              <Link to="/admin/colors">
                <ListItem
                  className={`hover:bg-gray-200 duration-800 rounded-xl transition-opacity duration-300 ${
                    isDropdownOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ListItemPrefix>
                    <SwatchIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Colors
                </ListItem>
              </Link>
              <Link to="/admin/sizes">
                <ListItem
                  className={`hover:bg-gray-200 duration-800 rounded-xl transition-opacity duration-300 ${
                    isDropdownOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ListItemPrefix>
                    <ArrowsPointingOutIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Sizes
                </ListItem>
              </Link>
            </>
          )}
        </div>

        <Link
          to="/admin/users"
          className="hover:bg-gray-200 transition-all duration-800 rounded-xl"
        >
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5 " />
            </ListItemPrefix>
            Users
          </ListItem>
        </Link>

        <Link
          to="/admin/orders"
          className="hover:bg-gray-200 transition-all duration-800 rounded-xl"
        >
          <ListItem>
            <ListItemPrefix>
              <ShoppingCartIcon className="h-5 w-5" />
            </ListItemPrefix>
            Orders
          </ListItem>
        </Link>
        
        <Link
          to="/admin/vouchers"
          className="hover:bg-gray-200 transition-all duration-800 rounded-xl"
        >
          <ListItem>
            <ListItemPrefix>
              <TicketIcon className="h-5 w-5" />
            </ListItemPrefix>
            Vouchers
          </ListItem>
        </Link>
        <ListItem className="hover:bg-gray-200 transition-all duration-800 rounded-xl">
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>

      
      </List>
    </Card>
  );
}
