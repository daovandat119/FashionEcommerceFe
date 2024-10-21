import React from 'react';
import { Typography, Card, CardBody, CardHeader } from "@material-tailwind/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Card className="shadow-lg transition-transform transform hover:scale-105">
          <CardHeader color="blue" className="text-white">
            Total Users
          </CardHeader>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="text-center">
              1,234
            </Typography>
          </CardBody>
        </Card>

        {/* Card 2 */}
        <Card className="shadow-lg transition-transform transform hover:scale-105">
          <CardHeader color="green" className="text-white">
            Active Users
          </CardHeader>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="text-center">
              987
            </Typography>
          </CardBody>
        </Card>

        {/* Card 3 */}
        <Card className="shadow-lg transition-transform transform hover:scale-105">
          <CardHeader color="red" className="text-white">
            Inactive Users
          </CardHeader>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="text-center">
              247
            </Typography>
          </CardBody>
        </Card>
      </div>

      <div className="mt-8">
        <Typography variant="h5" color="blue-gray" className="mb-4 font-bold">
          User Growth Over Time
        </Typography>
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>

      <div className="mt-6">
        <Typography variant="h5" color="blue-gray" className="mb-4 font-bold">
          Recent Activities
        </Typography>
        <ul className="list-disc pl-5">
          <li>User John Doe registered.</li>
          <li>User Jane Smith updated their profile.</li>
          <li>User Mike Johnson logged in.</li>
          <li>User Emily Davis logged out.</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
