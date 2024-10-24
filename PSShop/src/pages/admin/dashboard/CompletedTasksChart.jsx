// src/pages/admin/dashboard/CompletedTasksChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { month: 'Apr', tasks: 200 },
  { month: 'May', tasks: 300 },
  { month: 'Jun', tasks: 150 },
  { month: 'Jul', tasks: 400 },
  { month: 'Aug', tasks: 350 },
  { month: 'Sep', tasks: 500 },
  { month: 'Oct', tasks: 450 },
  { month: 'Nov', tasks: 600 },
  { month: 'Dec', tasks: 500 },
];

const CompletedTasksChart = () => {
  return (
    <div className="bg-white rounded-lg border border-black p-4">
      <h3 className="text-lg font-bold">Completed Tasks</h3>
      <p className="text-gray-600 mb-3">Last Campaign Performance</p>
      <LineChart width={1100} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="tasks" stroke="#4caf50" dot={{ r: 5 }} />
      </LineChart>
      <p className="text-gray-500 mt-2">Just updated</p>
    </div>
  );
};

export default CompletedTasksChart;

