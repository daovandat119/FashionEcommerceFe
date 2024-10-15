// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { Checkbox, Input, Typography } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import ToggleSwitch from '../components/ToggleSwitch';

const UserList = () => {
  const [Users, setUsers] = useState([
    {
      id: 1,
      Username : "user 1",
      Email : "admin1@gamil.com",
      Password : "123",
      active: true,
    },
    {
      id: 2,
      Username : "user 2",
      Email : "admin2@gamil.com",
      Password : "123",
      active: false,
    },
    // Add more products as needed
  ]);

  const handleToggleActive = (id) => {
    setUsers(
      Users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search products"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
          />
        </div>
        <Link to="/admin/users/add" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
          <PlusIcon className="h-5 w-5" /> New Product
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-max border-collapse">
          <thead className="hover:bg-gray-50">
            <tr>
              <th className="border-b p-4 text-left">ID</th>
              <th className="border-b p-4 text-left">UserName</th>
              <th className="border-b p-4 text-left">Email</th>
              <th className="border-b p-4 text-left">Active</th>
              <th className="border-b p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border-b p-1">
                  <Checkbox />
                </td>
                <td className="border-b p-4">${user.Username}</td>
                <td className="border-b p-4">${user.Email}</td>
                {/* <td className="border-b p-4">${user.active}</td> */}
                <td className="border-b p-4">
                  <ToggleSwitch
                    isOn={user.active}
                    handleToggle={() => handleToggleActive(user.id)}
                  />
                </td>
                <td className="border-b p-4">
                <Link
                    to={`/admin/users/edit/${user.id}`}
                    className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/admin/users/delete/${user.id}`}
                    className="bg-red-600 text-white p-2 rounded-full mr-2 hover:bg-red-500 transition-colors inline-flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList
