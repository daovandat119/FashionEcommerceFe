import React, { useEffect, useState } from "react";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import ActiveUsersChart from "./ActiveUsersChart";
import UserStatisticsTable from "./UserStatisticsTable";
import { GetUserStatistics } from "../../service/api_service";

const StatisticalUsers = () => {
  const [timePeriod, setTimePeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [bannedUsers, setBannedUsers] = useState(0);
  const [queryOrder, setQueryOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [year, setYear] = useState("");

  const userStatistics = async (
    timePeriod,
    startDate,
    endDate,
    currentPage,
    searchValue,
    year
  ) => {
    try {
      const response = await GetUserStatistics(
        timePeriod,
        startDate,
        endDate,
        currentPage,
        searchValue,
        year
      );
      setMonthlyRegistrations(response.data.monthlyRegistrations);
      setActiveUsers(response.data.activeCount);
      setBannedUsers(response.data.bannedCount);
      setQueryOrder(response.data);
    } catch (error) {
      console.error("Error fetching user statistics:", error);
    }
  };

  useEffect(() => {
    userStatistics(
      timePeriod,
      startDate,
      endDate,
      currentPage,
      searchValue,
      year
    );
  }, [timePeriod, startDate, endDate, currentPage, searchValue, year]);

  const handleChartTypeChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (searchValue) => {
    setSearchValue(searchValue);
  };

  const handleYearChange = (year) => {
    console.log(year);
    setYear(year);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold ml-5 pt-5">Thống Kê Người Dùng</h1>

      {/* Search Options */}
      <div className="filter-section p-4 bg-gray-100 rounded-md">
        <div className="flex justify-between">
          <div className="flex justify-start gap-4 w-full">
            <div className="w-[30%]">
              <label className="block mb-1">Khoảng thời gian</label>
              <select
                value={timePeriod}
                onChange={handleTimePeriodChange}
                className="border rounded-md p-2 w-full"
              >
                <option value="">Chọn khoảng thời gian</option>
                <option value="1_month">1 tháng gần nhất</option>
                <option value="6_months">6 tháng gần nhất</option>
                <option value="1_year">1 năm gần nhất</option>
              </select>
            </div>
            {!timePeriod && (
              <div className="w-[36%]">
                <label className="block mb-1">Chọn trong khoảng</label>
                <div className="flex gap-2">
                  <>
                    <input
                      type="date"
                      name="startDate"
                      onChange={handleChartTypeChange}
                      className="border rounded-md p-2 w-full"
                    />
                    <p className="mt-2">-</p>
                    <input
                      type="date"
                      name="endDate"
                      onChange={handleChartTypeChange}
                      className="border rounded-md p-2 w-full"
                    />
                  </>
                </div>
              </div>
            )}
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
              <div className="text-2xl font-bold">{activeUsers}</div>
            </div>
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
              <div className="text-2xl font-bold">{bannedUsers}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[97%] mx-auto my-4">
        <UserStatisticsTable
          data={queryOrder}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
        />
      </div>

      <div className="w-[97%] mx-auto my-4">
        <div className="">
          <ActiveUsersChart
            monthlyRegistrations={monthlyRegistrations}
            handleYearChange={handleYearChange}
          />
        </div>
      </div>
    </div>
  );
};

export default StatisticalUsers;
