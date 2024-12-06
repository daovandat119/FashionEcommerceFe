import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ProductPieChart = ({ data }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FFBB28", "#00C49F", "#0088FE", "#FF8042", "#FFBB28", "#00C49F"];
  
  const pieChartData = data.map(item => ({
    name: item.Category,
    value: parseInt(item.TotalSold, 10),
    total: parseFloat(item.TotalRevenue).toFixed(2)
  }));

  return (
    <div className="bg-white rounded-lg border-2 border-gray-300">
      <h2 className="text-xl font-semibold p-4">
        Thống kê sản phẩm đã bán của các danh mục
      </h2>
    
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip />
          <Legend layout="vertical" verticalAlign="top" align="right" />
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, value, total }) =>
              `${name}: ${value} (Tổng: ${Math.floor(total)} VND) `
            }
          >
            {pieChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={{ position: 'relative', margin: '0 10px' }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductPieChart;
