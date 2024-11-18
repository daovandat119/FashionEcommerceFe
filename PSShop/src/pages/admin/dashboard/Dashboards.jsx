import React, { useEffect, useState } from 'react';
import { Typography } from "@material-tailwind/react";
import { FaDollarSign, FaUsers, FaUserPlus, FaUser, FaEye, FaSignOutAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import WebsiteViewChart from './WebsiteViewChart';
import DailySalesChart from './DailySalesChart';
import CompletedTasksChart from './CompletedTasksChart';
import TransactionHistory from './TransactionHistory';
import CreditBalance from './CreditBalance';

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
            Dashboard
          </Typography>
          <div className="relative flex items-center gap-2 z-10">
            <div className='bg-black p-2 rounded-full cursor-pointer' onClick={toggleMenu}>
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
          {/* Card Today's Money */}
          <div className="shadow-lg transition-transform transform hover:scale-105 w-[24%] bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between">
            <div className='flex items-center justify-between pb-3 border-b-2'>
              <div className="flex p-3 justify-center bg-black rounded-xl">
                <div className="text-white text-2xl">
                  <FaDollarSign />
                </div>
              </div>
              <div className='flex flex-col items-end'>
                <p className="text-gray-600 font-medium">Today's Money</p>
                <div className="text-2xl font-bold ">
                  $53k
                </div>
              </div>
            </div>
            <div className="text-green-500 font-medium flex pt-3 gap-2">
              +55% <p className='text-black'>than last week</p>
            </div>
          </div>

          {/* Card Today's Users */}
          <div className="shadow-lg transition-transform transform hover:scale-105 w-[24%] bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between">
            <div className='flex items-center justify-between pb-3 border-b-2'>
              <div className="flex p-3 justify-center bg-black rounded-xl">
                <div className="text-white text-2xl">
                  <FaUsers />
                </div>
              </div>
              <div className='flex flex-col items-end'>
                <p className="text-gray-600 font-medium">Today's Users</p>
                <div className="text-2xl font-bold ">
                  2,300
                </div>
              </div>
            </div>
            <div className="text-green-500 font-medium flex pt-3 gap-2">
              +3% <p className='text-black'>than last month</p>
            </div>
          </div>

          {/* Card New Clients */}
          <div className="shadow-lg transition-transform transform hover:scale-105 w-[24%] bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between">
            <div className='flex items-center justify-between pb-3 border-b-2'>
              <div className="flex p-3 justify-center bg-black rounded-xl">
                <div className="text-white text-2xl">
                  <FaUserPlus />
                </div>
              </div>
              <div className='flex flex-col items-end'>
                <p className="text-gray-600 font-medium">New Clients</p>
                <div className="text-2xl font-bold ">
                  3,462
                </div>
              </div>
            </div>
            <div className="text-red-500 font-medium flex pt-3 gap-2">
              -2% <p className='text-black'>than yesterday</p>
            </div>
          </div>

          {/* Card Sales */}
          <div className="shadow-lg transition-transform transform hover:scale-105 w-[24%] bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between">
            <div className='flex items-center justify-between pb-3 border-b-2'>
              <div className="flex p-3 justify-center bg-black rounded-xl">
                <div className="text-white text-2xl">
                  <FaDollarSign />
                </div>
              </div>
              <div className='flex flex-col items-end'>
                <p className="text-gray-600 font-medium">Sales</p>
                <div className="text-2xl font-bold ">
                  $103,430
                </div>
              </div>
            </div>
            <div className="text-green-500 font-medium flex pt-3 gap-2">
              +5% <p className='text-black'>than yesterday</p>
            </div>
          </div>
        </div>

        {/* Biểu đồ */}
        <div className='flex justify-between gap-3 mt-4'>
          <div className='w-[50%]'>
            <WebsiteViewChart />
          </div>
          <div className='w-[50%]'>
            <DailySalesChart />
          </div>
        </div>
        <div className='mt-3 w-full'> <CompletedTasksChart /></div>

        <div className='flex gap-3 my-3'>
          <div className='w-[30%]'>
            <CreditBalance />
          </div>
          <div className='w-[70%]'>
            <TransactionHistory />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
