import React, { useEffect, useState } from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Bar,
} from "recharts";

const ActiveUsersChart = ({ monthlyRegistrations, handleYearChange }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
    const formattedData = allMonths.map((month) => {
      const item = monthlyRegistrations.find(
        (stat) => stat.Month === String(month).padStart(2, "0")
      );
      return {
        Month: `Tháng ${month}`,
        Total: item ? item.Total : 0,
      };
    });
    setChartData(formattedData);
  }, [monthlyRegistrations]);

  const onYearChange = (event) => {
    setSelectedYear(event.target.value);
    handleYearChange(event.target.value);
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg bg-white">
      <h2 className="text-lg font-semibold p-3">Thống Kê Đăng Ký Theo Tháng</h2>

      <div className="w-[20%] ml-12">
        <select
          value={selectedYear}
          onChange={onYearChange}
          className="border rounded-md p-2 w-full mb-2"
        >
          <option value="">Chọn Năm</option>
          {Array.from(
            { length: new Date().getFullYear() - 2020 + 1 },
            (_, i) => (
              <option key={2020 + i} value={2020 + i}>
                Năm {2020 + i}
              </option>
            )
          )}
        </select>
      </div>
      <BarChart width={1300} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Total" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default ActiveUsersChart;
