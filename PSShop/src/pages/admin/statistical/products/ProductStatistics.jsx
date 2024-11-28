import React, { useState, useEffect } from "react";
import ProductSalesTable from "./ProductSalesChart";
import ProductPieChart from "./ProductPieChart";
import { GetProductStatistics } from "../../service/api_service";

const ProductStatistics = () => {
  const [productName, setProductName] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productStatistics, setProductStatistics] = useState([]);
  const [categoryStatistics, setCategoryStatistics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProductStatistics = async (
    timePeriod,
    startDate,
    endDate,
    productName,
    currentPage
  ) => {
    const response = await GetProductStatistics(
      timePeriod,
      startDate,
      endDate,
      productName,
      currentPage
    );
    setProductStatistics(response.data.statisticsProduct);
    setCategoryStatistics(response.data.statisticsCategory);
  };

  useEffect(() => {
    fetchProductStatistics(
      timePeriod,
      startDate,
      endDate,
      productName,
      currentPage
    );
  }, [timePeriod, startDate, endDate, productName, currentPage]);

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };

  const handleChartTypeChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      console.log(value);
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  const handleSearch = (searchValue) => {
    setProductName(searchValue);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
                <option value="1_month">1 tháng gần nhất</option>
                <option value="3_months">3 tháng gần nhất</option>
                <option value="6_months">6 tháng gần nhất</option>
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

      <div className="my-4 w-[97%] mx-auto">
        <ProductPieChart data={categoryStatistics} />
      </div>

      <div className="my-4 w-[97%] mx-auto">
        <ProductSalesTable
          data={productStatistics}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ProductStatistics;
