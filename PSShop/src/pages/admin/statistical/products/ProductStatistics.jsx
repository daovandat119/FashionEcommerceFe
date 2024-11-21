import React, { useState } from "react";
import ProductLineChart from "./ProductsLineChart";
import ProductBarChart from "./ProductsBarChart";
import ProductSalesTable from "./ProductSalesChart";

const ProductStatistics = () => {
  const [productName, setProductName] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [date, setDate] = useState("");

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const lineChartData = [
    { date: "Thứ 2", sales: 45 },
    { date: "Thứ 3", sales: 20 },
    { date: "Thứ 4", sales: 50 },
    { date: "Thứ 5", sales: 40 },
    { date: "Thứ 6", sales: 60 },
    { date: "Thứ 7", sales: 70 },
    { date: "CN", sales: 30 },
  ];

  const barChartData = [
    { month: "Tháng 1", sales: 300 },
    { month: "Tháng 2", sales: 400 },
    { month: "Tháng 3", sales: 350 },
    { month: "Tháng 4", sales: 500 },
    { month: "Tháng 5", sales: 450 },
    { month: "Tháng 6", sales: 600 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold ml-5 pt-5">Thống Kê Sản Phẩm</h1>
      <div className="filter-section p-4 bg-gray-100 rounded-md">
        <div className="flex justify-between">
          <div className="flex justify-start gap-2 w-[100%]">
            <div className="w-[30%]">
              <label className="block mb-1">Tên sản phẩm</label>
              <input
                type="text"
                value={productName}
                onChange={handleProductNameChange}
                className="border rounded-md p-2 w-full"
                placeholder="Nhập tên sản phẩm"
              />
            </div>
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
            <div className="w-[30%]">
              <label className="block mb-1">Ngày</label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="border rounded-md p-2 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-[98%] mx-auto flex justify-center gap-4">
        <div className=" w-[48%]">
          <ProductLineChart data={lineChartData} />
        </div>

        <div className=" w-[48%]">
        <ProductSalesTable />
        </div>
      </div>
      
    </div>
  );
};

export default ProductStatistics;
