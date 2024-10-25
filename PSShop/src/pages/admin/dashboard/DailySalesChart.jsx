// src/pages/admin/dashboard/DailySalesChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { month: 'Apr', sales: 200 },
  { month: 'May', sales: 300 },
  { month: 'Jun', sales: 150 },
  { month: 'Jul', sales: 320 },
  { month: 'Aug', sales: 400 },
  { month: 'Sep', sales: 250 },
  { month: 'Oct', sales: 500 },
  { month: 'Nov', sales: 450 },
  { month: 'Dec', sales: 600 },
];

const DailySalesChart = () => {
  return (
    <div className="bg-white rounded-lg border border-black p-4">
      <h3 className="text-lg font-bold">Daily Sales</h3>
      <p className="text-gray-600  mb-4">15% increase in today sales</p>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="#007bff" dot={{ r: 5 }} />
      </LineChart>
      <p className="text-gray-500 mt-2">Updated 4 min ago</p>
    </div>
  );
};

export default DailySalesChart;
