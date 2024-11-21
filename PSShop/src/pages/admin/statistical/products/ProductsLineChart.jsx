import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductLineChart = ({ data }) => {
  return (
   <div className='bg-white rounded-lg border-2 border-gray-300'>
    <h2 className="text-xl font-semibold p-4">Kết quả thống kê (Theo ngày)</h2>
     <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
   </div>
  );
};

export default ProductLineChart;