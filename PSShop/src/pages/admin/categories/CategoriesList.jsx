import React, { useState } from "react";
import { Input, Checkbox } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ToggleSwitch from "../components/ToggleSwitch";
import { Link } from "react-router-dom";

const CategoriesList = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Category 1", active: true },
    { id: 2, name: "Category 2", active: false },
    // Add more categories as needed
  ]);

  const handleToggleActive = (id) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, active: !category.active }
          : category
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Categories Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search categories"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
          />
        </div>
        <Link
          to="/admin/categories/add-categories"
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5" /> New Category
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-max border-collapse">
          <thead className="bg-white">
            <tr>
              <th className="border-b p-4 text-left">ID</th>
              <th className="border-b p-4 text-left">Name</th>
              <th className="border-b p-4 text-left">Active</th>
              <th className="border-b p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="border-b p-1">
                  <Checkbox />
                </td>
                <td className="border-b p-4">{category.name}</td>
                <td className="border-b p-4">
                  <ToggleSwitch
                    isOn={category.active}
                    handleToggle={() => handleToggleActive(category.id)}
                  />
                </td>
                <td className="border-b p-4">
                  <Link
                    to={`/admin/categories/edit/${category.id}`}
                    className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesList;
