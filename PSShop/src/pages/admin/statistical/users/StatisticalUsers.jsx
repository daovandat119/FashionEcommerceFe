import React, { useState } from "react";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import ActiveUsersChart from "./ActiveUsersChart";
import BlockedUsersChart from "./BlockUsersChart";
import UserStatisticsTable from "./UserStatisticsTable";

const StatisticalUsers = () => {
  const [userType, setUserType] = useState("active"); // Default to active users
  const [timeRange, setTimeRange] = useState("today"); // Default to today
  const [selectedDate, setSelectedDate] = useState(""); // Thêm state cho ngày
  const [endDate, setEndDate] = useState(""); // Thêm state cho ngày kết thúc

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const handleDateChange = (e) => { // Hàm xử lý thay đổi ngày
    setSelectedDate(e.target.value);
  };

  const handleEndDateChange = (e) => { // Hàm xử lý thay đổi ngày kết thúc
    setEndDate(e.target.value);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold ml-5 pt-5 mb-5">Thống Kê Người Dùng</h1>
    
      {/* Search Options */}
      <div className="flex items-center justify-between w-[96%] mx-auto gap-2">
       <div className="flex items-center gap-2">
       <div>
          <select value={userType} onChange={handleUserTypeChange} className="border rounded p-1">
            <option value="active">Người dùng hoạt động</option>
            <option value="blocked">Người dùng bị chặn</option>
          </select>
        </div>

        <div>
          <select value={timeRange} onChange={handleTimeRangeChange} className="border rounded p-1">
            <option value="today">Hôm nay</option>
            <option value="yesterday">Hôm qua</option>
            <option value="lastWeek">Tuần trước</option>
            <option value="lastMonth">1 tháng trước</option>
            <option value="last3Months">3 tháng trước</option>
            <option value="last6Months">6 tháng trước</option>
            <option value="lastYear">1 năm trước</option>
          </select>
        </div>
       </div>

        <div className="flex items-center gap-2">
          <div>
            <label className="mr-2">Chọn trong khoảng</label>
            <input
            type="date" 
            value={selectedDate} 
            onChange={handleDateChange} 
            className="border rounded p-1" 
          />
        </div>
        <div>
          <label className="mr-2">-</label>
          <input 
            type="date" 
            value={endDate}
            onChange={handleEndDateChange}
            className="border rounded p-1" 
          />
        </div>
      </div>
      </div>

      <div className="flex justify-center gap-3 mt-4 w-[97%] mx-auto">
        <div className="w-[50%] shadow-lg transition-transform transform hover:scale-105 bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b-2">
            <div className="flex p-3 justify-center bg-black rounded-xl">
              <div className="text-white text-2xl">
                <FaUserPlus />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-gray-600 font-medium">Người dùng hoạt động</p>
              <div className="text-2xl font-bold">50</div>
            </div>
          </div>
          <div className="text-red-500 font-medium flex pt-3 gap-2">
            -2% <p className="text-black">so với tuần trước</p>
          </div>
        </div>

        <div className="w-[50%] shadow-lg transition-transform transform hover:scale-105 bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b-2">
            <div className="flex p-3 justify-center bg-black rounded-xl">
              <div className="text-white text-2xl">
                <FaUserPlus />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-gray-600 font-medium">Người dùng bị chặn</p>
              <div className="text-2xl font-bold">50</div>
            </div>
          </div>
          <div className="text-red-500 font-medium flex pt-3 gap-2">
            -2% <p className="text-black">so với tuần trước</p>
          </div>
        </div>
      </div>

      <div className="w-[97%] mx-auto my-4"> 
        <div className="">
          {userType === "active" ? <ActiveUsersChart /> : null}
        </div>
        <div className="">
          {userType === "blocked" ? <BlockedUsersChart /> : null}
        </div>
      </div>

      <div className="w-[97%] mx-auto my-4">
        <UserStatisticsTable />
      </div>
    </div>
  );
};

export default StatisticalUsers;
