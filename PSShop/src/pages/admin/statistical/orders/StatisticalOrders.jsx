import React, { useState, useEffect } from "react";
import OrderBarChart from "./OrderBarChart";
import RevenueChart from "./RevenueChart";
import OrderStatisticsTable from "./OrderStatisticsTable";
import { GetOrdersStatistics } from "../../service/api_service";
import { useNavigate } from "react-router-dom";

function StatisticalOrders() {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [year, setYear] = useState("");

  const GetOrderStatus = async (
    selectedTimePeriod,
    startDate,
    endDate,
    currentPage,
    searchValue,
    year
  ) => {
    const response = await GetOrdersStatistics(
      selectedTimePeriod,
      startDate,
      endDate,
      currentPage,
      searchValue,
      year
    );
    setData(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    GetOrderStatus(
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

  const handleEditOrder = (orderID) => {
    navigate(`/admin/orders/edit/${orderID}`, {
      state: { from: "statistics" },
    });
  };

  const handleYearChange = (year) => {
    setYear(year);
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold ml-5 pt-5">Thống Kê Đơn Hàng</h1>
      <div className="filter-section p-4 bg-gray-100 rounded-md">
        <div className="flex justify-between">
          <div className="flex justify-start gap-2 w-[100%]">
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

      <div className="w-[96%] mx-auto ">
        <OrderBarChart data={data} />
      </div>

      <div className="w-[96%] mx-auto my-4">
        <OrderStatisticsTable
          data={data}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEditOrder={handleEditOrder}
        />
      </div>

      <div className="w-[96%] mx-auto my-4">
        <RevenueChart data={data} handleYearChange={handleYearChange} />
      </div>
    </div>
  );
}

export default StatisticalOrders;
