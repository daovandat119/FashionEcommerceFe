import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button, Textarea, Checkbox } from "@material-tailwind/react";
import { ChevronDownIcon, CloudArrowUpIcon, PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { GetProductById, UpdateProduct, ListCategories, ListColors, ListSizes, AddProductVariant, GetProductVariants } from "../service/api_service";
import { toast, ToastContainer } from "react-toastify";

const UpdateProducts = () => {
  const { ProductID } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    ProductName: "",
    CategoryID: "",
    Price: "",
    SalePrice: "",
    ShortDescription: "",
    Description: "",
    Status: "active",
    MainImageURL: null,
    MainImagePreview: null,
    ImagePath: [],
    ImagePathPreviews: [],
  });
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [variantPrice, setVariantPrice] = useState("");
  const [variantQuantity, setVariantQuantity] = useState("");
  const [selectedVariants, setSelectedVariants] = useState([]);

  useEffect(() => {
    if (ProductID) {
      fetchProductData();
    } else {
      toast.error("Không tìm thấy ID sản phẩm");
      navigate("/admin/products");
    }
  }, []); // Chỉ chạy một lần khi component mount

  const fetchProductData = async () => {
    try {
      await Promise.all([
        fetchProduct(),
        fetchCategories(),
        fetchColors(),
        fetchSizes(),
        fetchProductVariants()
      ]);
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("Không thể tải thông tin sản phẩm");
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await GetProductById(ProductID);
      console.log("API Response:", response);
      if (response && response.data) {
        const product = response.data.product;
        console.log("Product data:", product);
        
        // Xử lý image_path
        const imagePaths = product.image_path ? product.image_path.split(',') : [];
        console.log("Processed ImagePath:", imagePaths);

        setProductData({
          ...product,
          MainImagePreview: product.MainImageURL ? `${import.meta.env.VITE_API_URL}/${product.MainImageURL}` : null,
          ImagePath: imagePaths,
          ImagePathPreviews: imagePaths.map(path => `${import.meta.env.VITE_API_URL}/${path.trim()}`),
        });
        console.log("Updated productData:", productData);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Không thể tải thông tin sản phẩm");
      navigate("/admin/products");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ListCategories(1, 1000);
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to load categories");
    }
  };

  const fetchColors = async () => {
    try {
      const response = await ListColors(1, 1000);
      setColors(response.data);
    } catch (err) {
      console.error("Error fetching colors:", err);
      toast.error("Failed to load colors");
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await ListSizes(1, 1000);
      setSizes(response.data);
    } catch (err) {
      console.error("Error fetching sizes:", err);
      toast.error("Failed to load sizes");
    }
  };

  const fetchProductVariants = async () => {
    try {
      const response = await GetProductVariants(ProductID);
      if (response && response.data) {
        setProductVariants(response.data);
      }
    } catch (error) {
      console.error("Error fetching product variants:", error);
      toast.error("Không thể tải danh sách biến thể sản phẩm");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "MainImageURL") {
        const file = files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setProductData((prevData) => ({
              ...prevData,
              [name]: file,
              MainImagePreview: e.target.result,
            }));
          };
          reader.readAsDataURL(file);
        }
      } else if (name === "ImagePath") {
        const fileArray = Array.from(files);
        const readerPromises = fileArray.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
        });

        Promise.all(readerPromises).then((results) => {
          setProductData((prevData) => ({
            ...prevData,
            ImagePath: fileArray, // Chỉ lưu các file mới
            ImagePathPreviews: results, // Chỉ lưu preview của các file mới
          }));
        });
      }
    } else {
      setProductData((prevData) => ({ ...prevData, [name]: value }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  const handleCategorySelect = (categoryId) => {
    setProductData({ ...productData, CategoryID: categoryId });
    setIsOpen(false);
    setErrors({ ...errors, CategoryID: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();
    for (const key in productData) {
      if (key === "ImagePath") {
        if (Array.isArray(productData[key])) {
          productData[key].forEach((file, index) => {
            if (file instanceof File) {
              formData.append(`ImagePath[${index}]`, file);
            }
          });
        }
      } else if (key === "MainImageURL" && productData[key] instanceof File) {
        formData.append(key, productData[key]);
      } else if (key !== "MainImagePreview" && key !== "ImagePathPreviews") {
        formData.append(key, productData[key]);
      }
    }

    try {
      const response = await UpdateProduct(ProductID, formData);
      console.log("API Response:", response);

      if (response && response.data) {
        navigate("/admin/products", {
          state: {
            success: true,
            message: "Sản phẩm đã được cập nhật thành công!",
            updatedProduct: response.data,
          },
        });
        toast.success("Sản phẩm đã được cập nhật thành công!");
      } else {
        throw new Error("Không nhận được phản hồi từ server");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      if (err.response && err.response.data) {
        setErrors(err.response.data);
        Object.values(err.response.data).forEach((errorMessages) => {
          if (Array.isArray(errorMessages)) {
            errorMessages.forEach((message) => {
              toast.error(message);
            });
          } else {
            toast.error(errorMessages);
          }
        });
      } else {
        toast.error(err.message || "Đã xảy ra lỗi khi cập nhật sn phẩm");
      }
    }
  };

  const renderImageUpload = (label, name, multiple = false) => {
    console.log(`Rendering ${name}:`, productData[name]);
    console.log(`${name} Previews:`, productData[`${name}Previews`]);
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {name === "MainImageURL" && productData.MainImagePreview ? (
              <img
                src={productData.MainImagePreview}
                alt="Preview"
                className="mx-auto h-32 w-32 object-cover"
              />
            ) : name === "ImagePath" && productData.ImagePathPreviews.length > 0 ? (
              <div className="flex flex-wrap justify-center">
                {productData.ImagePathPreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-32 object-cover m-1"
                  />
                ))}
              </div>
            ) : (
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={name}
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id={name}
                  name={name}
                  type="file"
                  className="sr-only"
                  onChange={handleChange}
                  multiple={multiple}
                  accept="image/*"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        {errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>
        )}
      </div>
    );
  };

  const handleColorChange = (colorId) => {
    setSelectedColors(prev => 
      prev.includes(colorId) ? prev.filter(id => id !== colorId) : [...prev, colorId]
    );
  };

  const handleSizeChange = (sizeId) => {
    setSelectedSizes(prev => 
      prev.includes(sizeId) ? prev.filter(id => id !== sizeId) : [...prev, sizeId]
    );
  };

  const handleAddVariant = async () => {
    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      toast.error("Vui lòng chọn ít nhất một màu và một kích thước");
      return;
    }

    if (!variantPrice || !variantQuantity) {
      toast.error("Vui lòng nhập giá và số lượng cho biến thể");
      return;
    }

    const variantData = {
      ProductID: ProductID,
      ColorID: selectedColors,
      SizeID: selectedSizes,
      Price: parseFloat(variantPrice),
      Quantity: parseInt(variantQuantity)
    };

    try {
      const response = await AddProductVariant(variantData);
      if (response && response.data) {
        toast.success("Biến thể đã được thêm thành công");
        await fetchProductVariants(); // Tải lại danh sách biến thể
      }
    } catch (error) {
      console.error("Lỗi khi thêm biến thể:", error);
      toast.error("Không thể thêm biến thể: " + (error.response?.data?.message || error.message));
    }

    // Reset form fields
    setSelectedColors([]);
    setSelectedSizes([]);
    setVariantPrice("");
    setVariantQuantity("");
  };

  const handleBackToList = () => {
    navigate("/admin/products"); // Điều hướng về trang danh sách sản phẩm
  };

 



  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Update Product</h1>
      <div className="flex flex-wrap -mx-4">
        {/* Left side - Update Product Form */}
        <div className="w-[40%] px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-4">
                <Input
                  label="Product Name"
                  name="ProductName"
                  value={productData.ProductName}
                  onChange={handleChange}
                  required
                />
                {errors.ProductName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ProductName[0]}
                  </p>
                )}
              </div>
              <div className="mb-4 relative">
                <button
                  type="button"
                  className="w-full px-2.5 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {productData.CategoryID
                    ? categories.find(
                        (cat) => cat.CategoryID === productData.CategoryID
                      )?.CategoryName
                    : "Select Category"}
                  <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </button>
                {isOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                    <ul className="py-1 overflow-auto text-base max-h-60">
                      {categories.map((category) => (
                        <li
                          key={category.CategoryID}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleCategorySelect(category.CategoryID)}
                        >
                          {category.CategoryName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {errors.CategoryID && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.CategoryID[0]}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Input
                  label="Price"
                  name="Price"
                  type="number"
                  value={productData.Price}
                  onChange={handleChange}
                  required
                />
                {errors.Price && (
                  <p className="text-red-500 text-xs mt-1">{errors.Price[0]}</p>
                )}
              </div>
              <div className="mb-4">
                <Input
                  label="Sale Price"
                  name="SalePrice"
                  type="number"
                  value={productData.SalePrice}
                  onChange={handleChange}
                />
                {errors.SalePrice && (
                  <p className="text-red-500 text-xs mt-1">{errors.SalePrice[0]}</p>
                )}
              </div>
              {renderImageUpload("Main Image", "MainImageURL")}
              {renderImageUpload("Other Images", "ImagePath", true)}
              <div className="mb-4">
                <Textarea
                  label="Short Description"
                  name="ShortDescription"
                  value={productData.ShortDescription}
                  onChange={handleChange}
                  rows={2}
                />
                {errors.ShortDescription && (
                  <p className="text-red-500 text-xs mt-1">{errors.ShortDescription[0]}</p>
                )}
              </div>
              <div className="mb-4">
                <Textarea
                  label="Description"
                  name="Description"
                  value={productData.Description}
                  onChange={handleChange}
                  rows={4}
                />
                {errors.Description && (
                  <p className="text-red-500 text-xs mt-1">{errors.Description[0]}</p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  color="blue"
                  onClick={handleBackToList}
                  className="mr-2"
                >
                   List Products
                </Button>
                <Button type="submit" color="green">
                  Update Product
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Right side - Colors, Sizes, and Product Variants */}
        <div className="w-[60%] ">
          {/* Colors */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Colors</h2>
            <div className="grid grid-cols-5 gap-4">
              {colors.map((color) => (
                <div key={color.ColorID} className="flex items-center">
                  <Checkbox
                    id={`color-${color.ColorID}`}
                    checked={selectedColors.includes(color.ColorID)}
                    onChange={() => handleColorChange(color.ColorID)}
                  />
                  <label htmlFor={`color-${color.ColorID}`} className="ml-2 text-sm">
                    {color.ColorName}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sizes */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Sizes</h2>
            <div className="grid grid-cols-5 gap-4">
              {sizes.map((size) => (
                <div key={size.SizeID} className="flex items-center">
                  <Checkbox
                    id={`size-${size.SizeID}`}
                    checked={selectedSizes.includes(size.SizeID)}
                    onChange={() => handleSizeChange(size.SizeID)}
                  />
                  <label htmlFor={`size-${size.SizeID}`} className="ml-2 text-sm">
                    {size.SizeName}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Add Product Variant section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Add Product Variant</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                label="Price"
                type="number"
                value={variantPrice}
                onChange={(e) => setVariantPrice(e.target.value)}
              />
              <Input
                label="Quantity"
                type="number"
                value={variantQuantity}
                onChange={(e) => setVariantQuantity(e.target.value)}
              />
            </div>
            
              <Button
                color="blue"
                className="flex items-center justify-center w-[100%]"
                onClick={handleAddVariant}
              >
                <PlusIcon className="h-5" />
                Add Product Variant
              </Button>
             
           
          </div>
          
          {/* Product Variants */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Product Variants</h2>
            <div className="max-h-[300px] overflow-y-auto">
              {productVariants.length > 0 ? (
                <table className="min-w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="text-center">
                      <th className="px-4 py-2 w-1">Select</th>
                      <th className="px-4 py-2">Color</th>
                      <th className="px-4 py-2">Size</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Quantity</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productVariants.map((variant, index) => (
                      <tr key={variant.VariantID || index} className="text-center">
                        <td className="border px-4 py-2 ">
                          <Checkbox
                            className="border-2 border-gray-400"
                          />
                        </td >
                        <td className="border px-4 py-2">{variant.ColorName || 'N/A'}</td>
                        <td className="border px-4 py-2">{variant.SizeName || 'N/A'}</td>
                        <td className="border px-4 py-2">{variant.Price}</td>
                        <td className="border px-4 py-2">{variant.Quantity}</td>
                        <td className="border px-4 py-2">
                          <button
                            className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="bg-red-500 text-white p-2 rounded-full mr-2 hover:bg-red-600 transition-colors inline-flex items-center justify-center"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Chưa có biến thể sản phẩm nào được thêm.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProducts;