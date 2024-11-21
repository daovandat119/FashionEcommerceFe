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
  ChartPieIcon,
} from "@heroicons/react/24/solid";

import logo from "../../../../public/assets/images/logo.png";

export function SidebarWithSearch() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStatsDropdownOpen, setIsStatsDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleStatsDropdown = () => {
    setIsStatsDropdownOpen(!isStatsDropdownOpen);
  };

  const toggleSettingsDropdown = () => {
    setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <Card className="h-[100vh] w-full max-w-[20rem] p-4 relative overflow-hidden">
      <div className="flex items-center justify-center py-3 mr-5">
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
            Tổng Quan
          </ListItem>
        </Link>

        <ListItem
          onClick={toggleDropdown}
          className="hover:bg-gray-200 transition-all duration-800 rounded-xl"
        >
          <ListItemPrefix>
            <CogIcon className="h-5 w-5" />
          </ListItemPrefix>
          Quản lý
          <ChevronRightIcon className="h-5 w-5 ml-20" />
        </ListItem>

        <div
          className={`mt-1 transition-all duration-300 ease-in-out z-50 ${
            isDropdownOpen ? " opacity-100 ml-5" : "h-0 opacity-0 overflow-hidden"
          }`}
        >
          {isDropdownOpen && (
            <>
              <Link to="/admin/products">
                <ListItem className="bg-white duration-300 border-b-2 border-gray-200 rounded-xl transition-opacity hover:bg-gray-100">
                  <ListItemPrefix>
                    <ShoppingBagIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Sản phẩm
                </ListItem>
              </Link>
              <Link to="/admin/categories">
                <ListItem className="bg-white duration-300 rounded-xl border-b-2 border-gray-200 transition-opacity hover:bg-gray-100">
                  <ListItemPrefix>
                    <InboxIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Danh mục
                </ListItem>
              </Link>
              <Link to="/admin/colors">
                <ListItem className="bg-white duration-300 rounded-xl border-b-2 border-gray-200 transition-opacity hover:bg-gray-100">
                  <ListItemPrefix>
                    <SwatchIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Màu sắc
                </ListItem>
              </Link>
              <Link to="/admin/sizes">
                <ListItem className="bg-white duration-300 rounded-xl border-b-2 border-gray-200 transition-opacity hover:bg-gray-100">
                  <ListItemPrefix>
                    <ArrowsPointingOutIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Kích thước
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
            Người dùng
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
            Đặt hàng
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

        <ListItem
          onClick={toggleStatsDropdown}
          className="hover:bg-gray-200 transition-all duration-800 rounded-xl"
        >
          <ListItemPrefix>
            <ChartPieIcon className="h-5 w-5" />
          </ListItemPrefix>
          Thống kê
          <ChevronRightIcon className="h-5 w-5 ml-16" />
        </ListItem>

        <div
          className={`mt-1 transition-all duration-300 ease-in-out z-50 ${
            isStatsDropdownOpen ? "ml-5 opacity-100" : "h-0 opacity-0 overflow-hidden"
          }`}
        >
          {isStatsDropdownOpen && (
            <>
              <Link to="/admin/user-statistics">
                <ListItem className="bg-white duration-300 border-b-2 border-gray-200 rounded-xl transition-opacity hover:bg-gray-100">
                  <ListItemPrefix>
                    <UserCircleIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Người dùng
                </ListItem>
              </Link>
              <Link to="/admin/order-statistics">
                <ListItem className="bg-white duration-300 rounded-xl border-b-2 border-gray-200 transition-opacity hover:bg-gray-100">
                  <ListItemPrefix>
                    <ShoppingCartIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Đơn hàng
                </ListItem>
              </Link>
              <Link to="/admin/product-statistics">
                <ListItem className="bg-white duration-300 rounded-xl border-b-2 border-gray-200 transition-opacity hover:bg-gray-100">
                  <ListItemPrefix>
                    <ShoppingBagIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Sản phẩm
                </ListItem>
              </Link>
              <Link to="/admin/revenue-statistics">
                <ListItem className="bg-white duration-300 rounded-xl border-b-2 border-gray-200 transition-opacity hover:bg-gray-100">
                  <ListItemPrefix>
                    <ChartBarIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Khác
                </ListItem>
              </Link>
            </>
          )}
        </div>

        <ListItem
          onClick={toggleSettingsDropdown}
          className="hover:bg-gray-200 transition-all duration-800 rounded-xl relative"
        >
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Cài đặt
          
        </ListItem>

        <div
          className={`mt-1 transition-all duration-300 ease-in-out ${
            isSettingsDropdownOpen ? "opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          {isSettingsDropdownOpen && (
            <div>
              <Link to="users/profile">
                <ListItem className="bg-white border-b-2 rounded-xl hover:bg-gray-100 duration-300">
                  <ListItemPrefix>
                    <UserCircleIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Thông tin Admin
                </ListItem>
              </Link>
              <ListItem
                onClick={handleLogout}
                className="bg-white border-b-2 rounded-xl hover:bg-gray-100 duration-300 cursor-pointer"
              >
                <ListItemPrefix>
                  <PowerIcon className="h-5 w-5" />
                </ListItemPrefix>
                Đăng xuất
              </ListItem>
            </div>
          )}
        </div>
      </List>
    </Card>
  );
}
