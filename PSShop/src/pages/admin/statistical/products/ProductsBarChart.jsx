import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductBarChart = ({ data }) => {
  return (
   <div className='bg-white rounded-lg border-2 border-gray-300'>
    <h2 className="text-xl font-semibold p-4">Kết quả thống kê (Theo tháng)</h2>
     <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
   </div>
  );
};

export default ProductBarChart;