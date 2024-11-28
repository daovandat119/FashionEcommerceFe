import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({data}) => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (data.statistics && Array.isArray(data.statistics)) {
      const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
      const formattedData = allMonths.map((month) => {
        const item = data.statistics.find((stat) => stat.Month === month);
        return {
          Date: `Tháng ${month}`,
          TotalRevenue: item ? parseFloat(item.TotalRevenue) : 0,
          TotalOrder: item ? item.TotalTransactions : 0,
        };
      });
      setChartData(formattedData);
    }
  }, [data]);

  const totalRevenue = chartData.reduce((acc, item) => acc + item.TotalRevenue, 0);
  const totalTransactions = chartData.reduce(
    (acc, item) => acc + item.TotalOrder,
    0
  );
  
  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 ">
     <div className="flex items-center gap-2 px-4">
     <h1 className="text-lg py-2 font-semibold pt-4 ">
        Doanh thu :
      </h1>
      <h4 className="text-xl font-bold pt-4 ">
        {totalRevenue.toLocaleString()}đ
      </h4>
     </div>
      <h4 className="text-xl font-bold  py-2 px-4">
        Tổng Đơn hàng: {totalTransactions.toLocaleString()}
      </h4>
      <ResponsiveContainer width="96%" height={405}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" />
          <YAxis />        
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="TotalRevenue" stroke="#82ca9d" />
          <Line type="monotone" dataKey="TotalOrder" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
