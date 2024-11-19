import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const OrderChart = () => {
    const data = {
        labels: ['11/15/2024', '11/16/2024', '11/17/2024'], // Dates
        datasets: [
            {
                label: 'Tổng đơn hàng',
                data: [1, 2, 1.5], // Sample data points
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4, // Smooth curve
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                height: 10,
                min: 1.0, // Giá trị tối thiểu
                max: 2.0, // Giá trị tối đa
                ticks: {
                    callback: function(value) {
                        if (value === 1.0 || value === 1.2 || value === 1.4 || value === 1.6 || value === 1.8 || value === 2.0) {
                            return value;
                        }
                    },
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Đơn hàng',
            },
        },
    };

    return (
        <>
        <div className='text-lg font-semibold border-t-2 border-gray-300 py-3'>Đơn hàng : 4</div>
        
        <Line data={data} options={options} /></>
    )
};

export default OrderChart