import React from 'react';
import { Typography, Card, CardBody, CardHeader } from "@material-tailwind/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FaDollarSign, FaUsers, FaUserPlus, FaChartLine } from 'react-icons/fa';
import WebsiteViewChart from './WebsiteViewChart'; // Đảm bảo đường dẫn đúng
import DailySalesChart from './DailySalesChart'; // Đảm bảo đường dẫn đúng
import CompletedTasksChart from './CompletedTasksChart'; // Đảm bảo đường dẫn đúng
import TransactionHistory from './TransactionHistory';
import CreditBalance from './CreditBalance';


const data = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 300 },
  { name: 'Mar', users: 500 },
  { name: 'Apr', users: 700 },
  { name: 'May', users: 600 },
  { name: 'Jun', users: 800 },
];

const Dashboard = () => {
  return (
    <>
    <div className="px-4  bg-gray-100">
      <Typography variant="h4" color="blue-gray" className="mb-6 font-bold">
        Dashboard
      </Typography>

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
      <DailySalesChart/>
      </div>

     </div>
    <div className='mt-3 w-full'> <CompletedTasksChart/></div>

    <div className='flex gap-3 my-3'>
    <div className='w-[30%]'>
      <CreditBalance/>
    </div>
    <div className='w-[70%]'>
      <TransactionHistory/>
    </div>
    
    </div>
    </div>
    </>
  );
}

export default Dashboard;
