import React from 'react';
import { Typography, Card, CardBody, CardHeader } from "@material-tailwind/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FaDollarSign, FaUsers, FaUserPlus, FaChartLine } from 'react-icons/fa';

const data = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 300 },
  { name: 'Mar', users: 500 },
  { name: 'Apr', users: 700 },
  { name: 'May', users: 600 },
  { name: 'Jun', users: 800 },
];

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Typography variant="h4" color="blue-gray" className="mb-6 font-bold">
        Dashboard
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Today's Money */}
        <Card className="shadow-lg transition-transform transform hover:scale-105 bg-white rounded-lg border border-gray-200">
          <CardHeader className="bg-blue-500 text-white flex items-center rounded-t-lg">
            <div className="bg-white text-blue-500 rounded-full p-2 mr-2">
              <FaDollarSign />
            </div>
            Today's Money
          </CardHeader>
          <CardBody className="text-center">
            <Typography variant="h5" color="blue-gray" className="font-bold">
              $53k
            </Typography>
            <Typography variant="body2" color="green">
              +55% than last week
            </Typography>
          </CardBody>
        </Card>

        {/* Card Today's Users */}
        <Card className="shadow-lg transition-transform transform hover:scale-105 bg-white rounded-lg border border-gray-200">
          <CardHeader className="bg-green-500 text-white flex items-center rounded-t-lg">
            <div className="bg-white text-green-500 rounded-full p-2 mr-2">
              <FaUsers />
            </div>
            Today's Users
          </CardHeader>
          <CardBody className="text-center">
            <Typography variant="h5" color="blue-gray" className="font-bold">
              2,300
            </Typography>
            <Typography variant="body2" color="green">
              +3% than last month
            </Typography>
          </CardBody>
        </Card>

        {/* Card New Clients */}
        <Card className="shadow-lg transition-transform transform hover:scale-105 bg-white rounded-lg border border-gray-200">
          <CardHeader className="bg-red-500 text-white flex items-center rounded-t-lg">
            <div className="bg-white text-red-500 rounded-full p-2 mr-2">
              <FaUserPlus />
            </div>
            <div className="flex-1 text-center">New Clients</div>
          </CardHeader>
          <CardBody className="flex flex-col items-center justify-center text-center">
            <Typography variant="h5" color="blue-gray" className="font-bold">
              3,462
            </Typography>
            <Typography variant="body2" color="red">
              -2% than yesterday
            </Typography>
          </CardBody>
        </Card>

        {/* Card Sales */}
        <Card className="shadow-lg transition-transform transform hover:scale-105 bg-white rounded-lg border border-gray-200">
          <CardHeader className="bg-purple-500 text-white flex items-center rounded-t-lg">
            <div className="bg-white text-purple-500 rounded-full p-2 mr-2">
              <FaChartLine />
            </div>
            Sales
          </CardHeader>
          <CardBody className="text-center">
            <Typography variant="h5" color="blue-gray" className="font-bold">
              $103,430
            </Typography>
            <Typography variant="body2" color="green">
              +5% than yesterday
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Biểu đồ */}
      <div className="mt-8">
        <Typography variant="h5" color="blue-gray" className="mb-4">
          User Growth
        </Typography>
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="users" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
}

export default Dashboard;
