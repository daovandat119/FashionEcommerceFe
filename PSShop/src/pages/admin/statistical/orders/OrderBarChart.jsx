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

import { GetOrderStatusStatistics } from "../../service/api_service";

const OrderBarChart = () => {
  const [data, setData] = useState([]);
  const GetOrderStatus = async () => {
    try {
      const response = await GetOrderStatusStatistics();
      if (response.data && Array.isArray(response.data)) {
        setData(
          response.data.map((item) => ({
            name: item.StatusName,
            sốLượng: item.TotalOrders,
          }))
        );
      } else {
        console.error(
          "No product data found or data is not in expected format."
        );
      }
    } catch (error) {
      console.error("Error fetching order statuses:", error);
    }
  };

  useEffect(() => {
    GetOrderStatus();
  }, []);

  return (
   <div className="bg-white rounded-lg border-2 border-gray-300  h-[570px]">
     <ResponsiveContainer  height={500}>
      <p className="text-lg font-semibold py-3 px-4">
        Đơn hàng : 4
      </p>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sốLượng" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
   </div>
  );
};

export default OrderBarChart;
