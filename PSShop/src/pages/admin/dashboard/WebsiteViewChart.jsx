import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { day: 'Thứ 2', 'đơn hàng': 40 },
  { day: 'Thứ 3', 'đơn hàng': 30 },
  { day: 'Thứ 4', 'đơn hàng': 20 },
  { day: 'Thứ 5', 'đơn hàng': 50 },
  { day: 'Thứ 6', 'đơn hàng': 40 },
  { day: 'Thứ 7', 'đơn hàng': 30 },
  { day: 'Chủ nhật', 'đơn hàng': 60 },
];

const WebsiteViewChart = () => {
  return (
    <div className="bg-white rounded-lg border border-black p-4">
      <h3 className="text-lg font-bold">Đơn hàng</h3>
      <p className="text-gray-600 mb-4">Thống kê đơn hàng trong tuần qua</p>
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="đơn hàng" fill="#4caf50" />
      </BarChart>
      <p className="text-gray-500 mt-2">Thống kê được cập nhật hôm nay</p>
    </div>
  );
};

export default WebsiteViewChart;

