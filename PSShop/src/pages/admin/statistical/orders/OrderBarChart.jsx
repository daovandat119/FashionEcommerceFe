import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const OrderBarChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    if (
      data.statisticsOrderStatus &&
      Array.isArray(data.statisticsOrderStatus)
    ) {
      setChartData(
        data.statisticsOrderStatus.map((item) => ({
          Name: item.StatusName,
          Quantity: item.TotalOrders,
          TotalRevenue: item.TotalRevenue,
        }))
      );
    }
  }, [data]);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 py-5 ">
      <ResponsiveContainer height={280}>
        <p className="text-lg font-semibold  px-4 relative bottom-5">
          Thống kê đơn hàng theo trạng thái
        </p>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Quantity" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderBarChart;
