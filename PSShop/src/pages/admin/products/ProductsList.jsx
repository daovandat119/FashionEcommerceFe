import React, { useState } from "react";
import { Input, Checkbox } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ToggleSwitch from "../components/ToggleSwitch";
import { Link } from "react-router-dom";
const ProductsList = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      category: "Category 1",
      price: 100,
      salePrice: 80,
      active: true,
    },
    {
      id: 2,
      name: "Product 2",
      category: "Category 2",
      price: 150,
      salePrice: 120,
      active: false,
    },
    // Add more products as needed
  ]);

  const handleToggleActive = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, active: !product.active } : product
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
        <Link to="/admin/products/add-product" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
          <PlusIcon className="h-5 w-5" /> New Product
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-max border-collapse">
          <thead className="hover:bg-gray-50">
            <tr>
              <th className="border-b p-4 text-left">ID</th>
              <th className="border-b p-4 text-left">Name</th>
              <th className="border-b p-4 text-left">Category</th>
              <th className="border-b p-4 text-left">Price</th>
              <th className="border-b p-4 text-left">Sale Price</th>
              <th className="border-b p-4 text-left">Active</th>
              <th className="border-b p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border-b p-1">
                  <Checkbox />
                </td>
                <td className="border-b p-4">${product.name}</td>
                <td className="border-b p-4">${product.category}</td>
                <td className="border-b p-4">${product.price}</td>
                <td className="border-b p-4">${product.salePrice}</td>
                <td className="border-b p-4">
                  <ToggleSwitch
                    isOn={product.active}
                    handleToggle={() => handleToggleActive(product.id)}
                  />
                </td>
                <td className="border-b p-4">
                <Link
                    to={`/admin/products/edit-product/${product.id}`}
                    className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/admin/products/delete-product/${product.id}`}
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

export default ProductsList;
