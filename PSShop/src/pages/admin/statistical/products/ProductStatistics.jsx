import React, { useState } from "react";
import ProductLineChart from "./ProductsLineChart";
import ProductBarChart from "./ProductsBarChart";
import ProductSalesTable from "./ProductSalesChart";
import ProductPieChart from "./ProductPieChart";

const ProductStatistics = () => {
  const [productName, setProductName] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };



  return (
    <div>
      <h1 className="text-2xl font-semibold ml-5 pt-5">Thống Kê Sản Phẩm</h1>
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
                <option value="today">Hôm nay</option>
                <option value="this_week">Tuần này</option>
                <option value="last_month">1 tháng gần nhất</option>
                <option value="last_3_months">3 tháng gần nhất</option>
                <option value="last_6_months">6 tháng gần nhất</option>
              </select>
            </div>
            <div className="w-[36%]">
              <label className="block mb-1">Chọn trong khoảng</label>
              <div className="flex gap-2">
                <input type="date" className="border rounded-md p-2 w-full" />
                <p className="mt-2">-</p>
                <input type="date" className="border rounded-md p-2 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

   

      
      <div className="my-4 w-[97%] mx-auto">
      <ProductPieChart />
      </div>

      <div className="my-4 w-[97%] mx-auto">
       
        <ProductSalesTable />
      </div>
     
    </div>
  );
};

export default ProductStatistics;
