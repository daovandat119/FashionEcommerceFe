import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

// Sample data for blocked users over a week
const data = [
  { day: 'Thứ 2', blockedUsers: 5 },
  { day: 'Thứ 3', blockedUsers: 10 },
  { day: 'Thứ 4', blockedUsers: 8 },
  { day: 'Thứ 5', blockedUsers: 12 },
  { day: 'Thứ 6', blockedUsers: 15 },
  { day: 'Thứ 7', blockedUsers: 20 },
  { day: 'CN', blockedUsers: 18 },
];

const BlockedUsersChart = () => {
  return (
    <div className="w-full border border-gray-200 rounded-lg bg-white">
      <h2 className="text-xl font-semibold mb-4 p-3">Thống Kê Người Dùng Bị Chặn Trong Tuần</h2>
      <LineChart width={1300} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="blockedUsers" stroke="#ff7300" />
      </LineChart>
    </div>
  );
};

export default BlockedUsersChart;