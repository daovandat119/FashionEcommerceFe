import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductLineChart = () => {
  // Dữ liệu cứng tạm thời
  const lineChartData = [
    { date: "Thứ 2", sales: 45 },
    { date: "Thứ 3", sales: 20 },
    { date: "Thứ 4", sales: 50 },
    { date: "Thứ 5", sales: 40 },
    { date: "Thứ 6", sales: 60 },
    { date: "Thứ 7", sales: 70 },
    { date: "CN", sales: 30 },
  ];

  return (
    <div className='bg-white rounded-lg border-2 border-gray-300'>
      <h2 className="text-xl font-semibold p-4">Kết quả thống kê (Theo ngày)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineChartData}> {/* Sử dụng dữ liệu cứng */}
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