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

const ActiveUsersChart = ({ monthlyRegistrations }) => {
  const [chartData, setChartData] = useState([]);

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

  return (
    <div className="w-full border border-gray-200 rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-4  p-3">
        Thống Kê Đăng Ký Theo Tháng
      </h2>
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
