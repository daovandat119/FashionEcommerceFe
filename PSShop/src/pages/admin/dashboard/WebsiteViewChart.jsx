import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { day: 'M', views: 40 },
  { day: 'T', views: 30 },
  { day: 'W', views: 20 },
  { day: 'T', views: 50 },
  { day: 'F', views: 40 },
  { day: 'S', views: 30 },
  { day: 'S', views: 60 },
];

const WebsiteViewChart = () => {
  return (
    <div className="bg-white rounded-lg border border-black p-4">
      <h3 className="text-lg font-bold">Website View</h3>
      <p className="text-gray-600 mb-4">Last Campaign Performance</p>
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="views" fill="#4caf50" />
      </BarChart>
      <p className="text-gray-500 mt-2">Campaign sent 2 days ago</p>
    </div>
  );
};

export default WebsiteViewChart;

