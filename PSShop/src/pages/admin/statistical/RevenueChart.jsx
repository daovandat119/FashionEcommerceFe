import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Dữ liệu mẫu cho thống kê doanh thu
const data = [
  { date: '21/02/2020', revenue: 5000000 },
  { date: '22/02/2020', revenue: 6000000 },
  { date: '23/02/2020', revenue: 7000000 },
  { date: '24/02/2020', revenue: 8000000 },
  { date: '25/02/2020', revenue: 9000000 },
  { date: '26/02/2020', revenue: 10000000 },
  { date: '27/02/2020', revenue: 11000000 },
  { date: '28/02/2020', revenue: 12000000 },
  { date: '01/03/2020', revenue: 13000000 },
  { date: '02/03/2020', revenue: 14000000 },
  { date: '03/03/2020', revenue: 15000000 },
  { date: '04/03/2020', revenue: 16000000 },
  { date: '05/03/2020', revenue: 17000000 },
];

const RevenueChart = () => {
  const totalRevenue = data.reduce((acc, item) => acc + item.revenue, 0);

  return (
    <div>
      <h3 className="text-lg border-t-2 border-gray-300 py-3 font-semibold ">Doanh thu</h3>
      <h4 className="text-xl font-bold mt-2 mb-5">{totalRevenue.toLocaleString()}đ</h4>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;