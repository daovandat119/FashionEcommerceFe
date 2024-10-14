import React, { useEffect, useState } from "react";
import { Input, Checkbox } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ToggleSwitch from "../components/ToggleSwitch";
import { Link } from "react-router-dom";
import { ListCategories } from "../service/api_service";
import axios from "axios";

const CategoriesList = () => {
  const [ListCategorie, setListCategorie] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    let res = await ListCategories();
    //Nếu có respone và respone có data
    //res.data.data truy cập
    if (res && res.data ) {
      setListCategorie(res.data);
    }
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
          to="/admin/categories/add"
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5" /> New Category
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-max border-collapse">
          <thead className="bg-white">
            <tr>
              <th className="border-b p-4 w-1/6 text-left">Select</th>
              <th className="border-b p-4 text-left">Name</th>
              <th className="border-b p-4 text-left">Active</th>
              <th className="border-b p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ListCategorie &&
              ListCategorie.length > 0 &&
              ListCategorie.map((item, index) => {
                return (
                  <tr key={`categories-${index}`} className="hover:bg-gray-50">
                    <td className="border-b p-1">
                      <Checkbox className="border-2 border-gray-400" />
                    </td>
                    <td className="border-b p-4">{item.CategoryName}</td>
                    <td className="border-b p-4">
                      <ToggleSwitch />
                    </td>
                    <td className="border-b p-4">
                      <Link
                        to="/admin/categories/edit/1"
                        className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesList;
