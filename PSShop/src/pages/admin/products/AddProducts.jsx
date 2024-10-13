import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Textarea, Checkbox } from "@material-tailwind/react";
import { ChevronDownIcon, CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { Image, Table } from "react-bootstrap";

const AddProducts = () => {
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    price: "",
    salePrice: "",
    description: "",
    shortDescription: "",
    mainImage: null,
    pathImage: null,
    size: "",
    color: "",
    quantity: "",
    variantPrice: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Books" },
    { id: 4, name: "Home & Garden" },
    { id: 5, name: "Toys & Games" },
  ];

  const [previews, setPreviews] = useState({
    mainImage: null,
    pathImage: null,
  });

  const [variantData, setVariantData] = useState({
    sizes: [],
    colors: [],
    quantity: "",
    price: "",
  });

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = ["Red", "Blue", "Green", "Yellow", "Black", "White"];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setProductData((prev) => ({ ...prev, [name]: files[0] }));
      if (files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => ({ ...prev, [name]: reader.result }));
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategorySelect = (categoryName) => {
    setProductData((prevData) => ({
      ...prevData,
      category: categoryName,
    }));
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New product:", productData);
  };

  const renderImageUpload = (label, name) => (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {previews[name] ? (
            <img
              src={previews[name]}
              alt="Preview"
              className="mx-auto h-32 w-32 object-cover rounded-md"
            />
          ) : (
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={`file-upload-${name}`}
              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id={`file-upload-${name}`}
                name={name}
                type="file"
                className="sr-only"
                onChange={handleChange}
                accept="image/*"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );

  const handleSizeChange = (size) => {
    setVariantData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleColorChange = (color) => {
    setVariantData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleChangeVariant = (e) => {
    const { name, value } = e.target;
    setVariantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVariants = () => {
    const variants = [];
    variantData.sizes.forEach((size) => {
      variantData.colors.forEach((color) => {
        variants.push({
          size,
          color,
          quantity: variantData.quantity,
          price: variantData.price,
        });
      });
    });
    console.log(variants); // Here you would typically send this data to your backend
    setVariantData({ sizes: [], colors: [], quantity: "", price: "" });
  };

  return (
    <div className="flex ">
      <div className="w-3/4 px-4  mx-auto ">
        <h1 className="text-2xl font-bold mb-6">Add Product </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Product Name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
            />
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="w-full px-2.5 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onClick={() => setIsOpen(!isOpen)}
              >
                {productData.category || "Select Category"}
                <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1 absolute right-2 top-1/2 transform -translate-y-1/2" />
              </button>
              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                  <ul className="py-1 overflow-auto text-base max-h-60">
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleCategorySelect(category.name)}
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Input
              label="Price"
              name="price"
              type="number"
              value={productData.price}
              onChange={handleChange}
              required
            />
            <Input
              label="Sale Price"
              name="salePrice"
              type="number"
              value={productData.salePrice}
              onChange={handleChange}
            />
            {renderImageUpload("Main Image", "mainImage")}
            {renderImageUpload("Path Image", "pathImage")}
            <Textarea
              label="Description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              rows={4}
            />
            <Textarea
              label="Short Description"
              name="shortDescription"
              value={productData.shortDescription}
              onChange={handleChange}
              rows={2}
            />
            <Button type="submit" color="green">
              Add Product
            </Button>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default AddProducts;
