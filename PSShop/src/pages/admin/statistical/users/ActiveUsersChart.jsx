import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

// Sample data for active users over a week
const data = [
  { day: 'Thứ 2', activeUsers: 20 },
  { day: 'Thứ 3', activeUsers: 35 },
  { day: 'Thứ 4', activeUsers: 50 },
  { day: 'Thứ 5', activeUsers: 40 },
  { day: 'Thứ 6', activeUsers: 60 },
  { day: 'Thứ 7', activeUsers: 70 },
  { day: 'Chủ Nhật', activeUsers: 55 },
];

const ActiveUsersChart = () => {
  return (
    <div className="w-full border border-gray-200 rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-4  p-3">Thống Kê Người Dùng Hoạt Động Trong Tuần</h2>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="activeUsers" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default ActiveUsersChart;