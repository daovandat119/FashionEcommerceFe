import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Dữ liệu mẫu cho thống kê đơn hàng
const data = [
  { name: 'Đơn hàng tháng 1', sốLượng: 4000 },
  { name: 'Đơn hàng tháng 2', sốLượng: 3000 },
  { name: 'Đơn hàng tháng 3', sốLượng: 2000 },
  { name: 'Đơn hàng tháng 4', sốLượng: 2780 },
  { name: 'Đơn hàng tháng 5', sốLượng: 1890 },
  { name: 'Đơn hàng tháng 6', sốLượng: 2390 },
];

const OrderBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
        <p className='text-lg font-semibold border-t-2 border-gray-300 py-3'>Đơn hàng : 4</p>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sốLượng" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OrderBarChart;