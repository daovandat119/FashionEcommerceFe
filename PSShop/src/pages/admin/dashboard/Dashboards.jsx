import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import {
  FaDollarSign,
  FaUsers,
  FaUserPlus,
  FaUser,
  FaEye,
  FaSignOutAlt,
  FaBox,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import OrderBarChart from "../statistical/orders/OrderBarChart";
import ProductLineChart from "../statistical/products/ProductsLineChart";
import ActiveUsersChart from "../statistical/users/ActiveUsersChart";
import OrderStatisticsTable from "../statistical/orders/OrderStatisticsTable";
import UserStatisticsTable from "../statistical/users/UserStatisticsTable";
import StatisticalUsers from "../statistical/users/StatisticalUsers";

const Dashboard = () => {
  const { showToast, setShowToast, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (showToast) {
      toast.success("Đăng nhập thành công!");
      setShowToast(false);
    }
  }, [showToast, setShowToast]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleProfileClick = () => {
    navigate("/admin/users/profile");
  };

  return (
    <>
      <ToastContainer />
      <div className="px-4 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" color="blue-gray" className="font-bold ml-5">
            Tổng quan
          </Typography>
          <div className="relative flex items-center gap-2 z-10">
            <div
              className="bg-black p-2 rounded-full cursor-pointer"
              onClick={toggleMenu}
            >
              <FaUser className="text-white" />
            </div>
            <h1 className="text-gray-800 mr-10">Chào Admin</h1>
            {menuOpen && (
              <div className="absolute right-3 mt-36 w-40 bg-white shadow-lg rounded-lg">
                <ul className="py-2">
                  <li
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleProfileClick}
                  >
                    <FaEye className="mr-2" />
                    Profile
                  </li>
                  <li
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between h-[150px] ">
          {/* Card Sales */}
          <div className="shadow-lg transition-transform transform hover:scale-105 w-[24%] bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b-2">
              <div className="flex p-3 justify-center bg-black rounded-xl">
                <div className="text-white text-2xl">
                  <FaBox />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-gray-600 font-medium">Đơn hàng hôm nay</p>
                <div className="text-2xl font-bold ">10</div>
              </div>
            </div>
            <div className="text-green-500 font-medium flex pt-3 gap-2">
              +5% <p className="text-black">so với tuần trước</p>
            </div>
          </div>
          {/* Card Today's Money */}

          <div className="shadow-lg transition-transform transform hover:scale-105 w-[24%] bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b-2">
              <div className="flex p-3 justify-center bg-black rounded-xl">
                <div className="text-white text-2xl">
                  <FaBox />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-gray-600 font-medium">Doanh thu hôm nay</p>
                <div className="text-2xl font-bold ">500.000 vnđ</div>
              </div>
            </div>
            <div className="text-green-500 font-medium flex pt-3 gap-2">
              +55% <p className="text-black">so với tuần trước</p>
            </div>
          </div>

          {/* Card Today's Users */}
          <div className="shadow-lg transition-transform transform hover:scale-105 w-[24%] bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b-2">
              <div className="flex p-3 justify-center bg-black rounded-xl">
                <div className="text-white text-2xl">
                  <FaUsers />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-gray-600 font-medium">
                  Người dùng hoạt động
                </p>
                <div className="text-2xl font-bold ">300</div>
              </div>
            </div>
            <div className="text-green-500 font-medium flex pt-3 gap-2">
              +3% <p className="text-black">so với tuần trước</p>
            </div>
          </div>

          {/* Card New Clients */}
          <div className="shadow-lg transition-transform transform hover:scale-105 w-[24%] bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b-2">
              <div className="flex p-3 justify-center bg-black rounded-xl">
                <div className="text-white text-2xl">
                  <FaUserPlus />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-gray-600 font-medium">Người dùng bị chặn</p>
                <div className="text-2xl font-bold ">50</div>
              </div>
            </div>
            <div className="text-red-500 font-medium flex pt-3 gap-2">
              -2% <p className="text-black">so với tuần trước</p>
            </div>
          </div>
        </div>

        {/* Biểu đồ */}
        {/* <div className='flex justify-between gap-3 mt-4'>
          <div className='w-[50%]'>
            <OrderBarChart />
          </div>
          <div className='w-[50%]'>
            <ProductLineChart />
          </div>
        </div>
        <div className='mt-3 w-full'> <ActiveUsersChart /></div>
          {/* Bảng thống kê */}
        <div className="flex gap-3 my-3">
          {/* <div className='w-[50%]'>
            <OrderStatisticsTable />
          </div> */}
          <div className="w-[50%]">
            <StatisticalUsers />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
