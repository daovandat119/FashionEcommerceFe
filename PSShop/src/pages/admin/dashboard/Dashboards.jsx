import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import {
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
import OrderStatisticsTable from "../statistical/orders/OrderStatisticsTable";
import UserStatisticsTable from "../statistical/users/UserStatisticsTable";
import {
  GetOrdersStatistics,
  GetProductStatistics,
  GetUserStatistics,
} from "../service/api_service";
import ProductPieChart from "../statistical/products/ProductPieChart";

const Dashboard = () => {
  const { showToast, setShowToast, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [ordersStatistics, setOrdersStatistics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeUsers, setActiveUsers] = useState(0);
  const [bannedUsers, setBannedUsers] = useState(0);
  const [queryUser, setQueryUser] = useState([]);
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const [searchValueUser, setSearchValueUser] = useState("");
  const [categoryStatistics, setCategoryStatistics] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (showToast) {
      toast.success("Đăng nhập thành công!");
      setShowToast(false);
    }
  }, [showToast, setShowToast]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (searchValue) => {
    setSearchValue(searchValue);
  };

  const handleEditOrder = (orderID) => {
    navigate(`/admin/orders/edit/${orderID}`, { state: { from: "dashboard" } });
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleProfileClick = () => {
    navigate("/admin/users/profile");
  };

  const fetchProductStatistics = async () => {
    const response = await GetProductStatistics();
    setCategoryStatistics(response.data.statisticsCategory);
  };

  useEffect(() => {
    fetchProductStatistics();
  }, []);

  useEffect(() => {
    if (
      ordersStatistics.statistics &&
      Array.isArray(ordersStatistics.statistics)
    ) {
      const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
      const formattedData = allMonths.map((month) => {
        const item = ordersStatistics.statistics.find(
          (stat) => stat.Month === month
        );
        return {
          Date: `Tháng ${month}`,
          TotalRevenue: item ? parseFloat(item.TotalRevenue) : 0,
          TotalOrder: item ? item.TotalTransactions : 0,
        };
      });
      setChartData(formattedData);
    }
  }, [ordersStatistics]);

  const totalRevenue = chartData.reduce(
    (acc, item) => acc + item.TotalRevenue,
    0
  );
  const totalTransactions = chartData.reduce(
    (acc, item) => acc + item.TotalOrder,
    0
  );

  const fetchOrdersStatisticsData = async (
    TimePeriod,
    startDate,
    endDate,
    currentPage,
    searchValue
  ) => {
    const response = await GetOrdersStatistics(
      TimePeriod,
      startDate,
      endDate,
      currentPage,
      searchValue
    );
    setOrdersStatistics(response.data);
  };

  useEffect(() => {
    fetchOrdersStatisticsData(
      selectedTimePeriod,
      startDate,
      endDate,
      currentPage,
      searchValue
    );
  }, [selectedTimePeriod, startDate, endDate, currentPage, searchValue]);

  const handlePageChangeUser = (newPage) => {
    setCurrentPageUser(newPage);
  };

  const handleSearchUser = (searchValue) => {
    setSearchValueUser(searchValue);
  };

  const userStatistics = async (
    timePeriod,
    startDate,
    endDate,
    currentPageUser,
    searchValueUser
  ) => {
    try {
      const response = await GetUserStatistics(
        timePeriod,
        startDate,
        endDate,
        currentPageUser,
        searchValueUser
      );
      setActiveUsers(response.data.activeCount);
      setBannedUsers(response.data.bannedCount);
      setQueryUser(response.data);
    } catch (error) {
      console.error("Error fetching user statistics:", error);
    }
  };

  useEffect(() => {
    userStatistics(
      selectedTimePeriod,
      startDate,
      endDate,
      currentPageUser,
      searchValueUser
    );
  }, [
    selectedTimePeriod,
    startDate,
    endDate,
    currentPageUser,
    searchValueUser,
  ]);

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
                <p className="text-gray-600 font-medium">Tổng số đơn hàng</p>
                <div className="text-2xl font-bold ">{totalTransactions}</div>
              </div>
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
                <p className="text-gray-600 font-medium">Tổng doanh thu</p>
                <div className="text-2xl font-bold ">
                  {Math.floor(totalRevenue)} VND
                </div>
              </div>
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
                <div className="text-2xl font-bold ">{activeUsers}</div>
              </div>
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
                <div className="text-2xl font-bold ">{bannedUsers}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-100%] my-3">
          <OrderBarChart width={400} data={ordersStatistics} />
        </div>
        <div className="w-[100%]">
          <ProductPieChart data={categoryStatistics} />
        </div>
        <div className="w-[100%] mt-3">
          <OrderStatisticsTable
            data={ordersStatistics}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onEditOrder={handleEditOrder}
          />
        </div>
        <div className="w-[100%] my-3">
          <UserStatisticsTable
            data={queryUser}
            onPageChange={handlePageChangeUser}
            onSearch={handleSearchUser}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
