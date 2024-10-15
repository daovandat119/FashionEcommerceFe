import { MagnifyingGlassIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/solid';
import { Checkbox, Input } from '@material-tailwind/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ToggleSwitch from '../components/ToggleSwitch';

const SizeList = () => {
  const [sizes, setSizes] = useState([
    {
      id: 1,
      sizeName: "Small",
      active: true,
    },
    {
      id: 2,
      sizeName: "Medium",
      active: false,
    },
    {
      id: 3,
      sizeName: "Large",
      active: true,
    },
    // Add more sizes as needed
  ]);

  const handleToggleActive = (id) => {
    setSizes(
      sizes.map((size) =>
        size.id === id ? { ...size, active: !size.active } : size
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sizes Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search sizes"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
          />
        </div>
        <Link to="/admin/sizes/add" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
          <PlusIcon className="h-5 w-5" /> New Size
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-max border-collapse">
          <thead className="hover:bg-gray-50">
            <tr>
              <th className="border-b p-4 text-left">ID</th>
              <th className="border-b p-4 text-left">Size</th>
              <th className="border-b p-4 text-left">Active</th>
              <th className="border-b p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((size) => (
              <tr key={size.id} className="hover:bg-gray-50">
                <td className="border-b p-1">
                  <Checkbox />
                </td>
                <td className="border-b p-4">{size.sizeName}</td>
                <td className="border-b p-4">
                  <ToggleSwitch
                    isOn={size.active}
                    handleToggle={() => handleToggleActive(size.id)}
                  />
                </td>
                <td className="border-b p-4">
                  <Link
                    to={`/admin/sizes/edit/${size.id}`}
                    className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/admin/sizes/delete/${size.id}`}
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

export default SizeList;
