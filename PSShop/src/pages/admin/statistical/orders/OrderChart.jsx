import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

import { GetOrderStatusStatistics } from "../../service/api_service";

const OrderChart = () => {
  const [data, setData] = useState([]);

  const GetOrderStatus = async () => {
    try {
      const response = await GetOrderStatusStatistics();
      if (response.data && Array.isArray(response.data)) {
        setData(
          response.data.map((item) => ({
            Date: item.StatusName,
            TotalOrder: item.TotalOrders,
            TotalCancel: item.TotalCancel,
          }))
        );
      } else {
        console.error(
          "No product data found or data is not in expected format."
        );
      }
    } catch (error) {
      console.error("Error fetching order statuses:", error);
    }
  };

  useEffect(() => {
    GetOrderStatus();
  }, []);

  const dataOk = {
    labels: data.map((item) => item.Date),
    datasets: [
      {
        label: "Tổng đơn hàng",
        data: data.map((item) => item.TotalOrder),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        height: 10,
        min: 1.0,
        max: 2.0,
        ticks: {
          callback: function (value) {
            if (
              value === 1.0 ||
              value === 1.2 ||
              value === 1.4 ||
              value === 1.6 ||
              value === 1.8 ||
              value === 2.0
            ) {
              return value;
            }
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Đơn hàng",
      },
    },
  };

  return (
    <>
      <div className="text-lg font-semibold border-t-2 border-gray-300 py-3">
        Đơn hàng : {data.reduce((total, item) => total + item.TotalOrder, 0)}
      </div>

      <Line data={dataOk} options={options} />
    </>
  );
};

export default OrderChart;
