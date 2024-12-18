import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductsBarChart = () => {
  // Dữ liệu cứng tạm thời
  const data = [
    { month: "Tháng 1", sales: 300 },
    { month: "Tháng 2", sales: 400 },
    { month: "Tháng 3", sales: 350 },
    { month: "Tháng 4", sales: 500 },
    { month: "Tháng 5", sales: 450 },
    { month: "Tháng 6", sales: 600 },
  ];

  return (
    <div className='bg-white rounded-lg border-2 border-gray-300'>
      <h2 className="text-xl font-semibold p-4">Kết quả thống kê (6 tháng)</h2>
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

export default ProductsBarChart;