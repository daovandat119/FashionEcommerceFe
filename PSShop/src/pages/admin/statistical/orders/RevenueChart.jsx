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

import { GetOrdersStatistics } from "../../service/api_service";

const RevenueChart = () => {
  const [data, setData] = useState([]);

  const GetRevenueStatistics = async () => {
    const response = await GetOrdersStatistics();

    if (response.data && Array.isArray(response.data)) {
      const formattedData = response.data.map((item) => ({
        Date: `Tháng ${item.Month}`,
        TotalRevenue: parseFloat(item.TotalRevenue),
        TotalOrder: item.TotalTransactions,
      }));
      setData(formattedData);
    } else {
      console.error("No product data found or data is not in expected format.");
    }
  };

  useEffect(() => {
    GetRevenueStatistics();
  }, []);
  const totalRevenue = data.reduce((acc, item) => acc + item.TotalRevenue, 0);
  const totalTransactions = data.reduce(
    (acc, item) => acc + item.TotalOrder,
    0
  );

  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 ">
     <div className="flex items-center gap-2 px-4">
     <h1 className="text-lg py-2 font-semibold ">
        Doanh thu :
      </h1>
      <h4 className="text-xl font-bold ">
        {totalRevenue.toLocaleString()}đ
      </h4>
     </div>
      <h4 className="text-xl font-bold  py-2 px-4">
        Tổng Đơn hàng: {totalTransactions.toLocaleString()}
      </h4>
      <ResponsiveContainer width="96%" height={405}>
        <LineChart data={data}>
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
