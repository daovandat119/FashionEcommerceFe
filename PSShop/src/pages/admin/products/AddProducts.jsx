import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddProduct, ListCategories } from "../service/api_service";
import { Input, Button, Textarea } from "@material-tailwind/react";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa"; // Import icon spinner
import Swal from "sweetalert2"; // Import SweetAlert

const AddProducts = () => {
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
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    fetchCategories();

    return () => {
      // Cleanup function
      if (productData.MainImagePreview) {
        URL.revokeObjectURL(productData.MainImagePreview);
      }
      productData.ImagePathPreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  const fetchCategories = () => {
    ListCategories(1, "")
      .then((response) => {
        setCategories(response.data); // Đảm bảo rằng response.data chứa danh sách danh mục
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        Swal.fire("Lỗi", "Không thể tải danh mục", "error"); // Thay đổi từ toast thành swal
      });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "MainImageURL") {
        const file = files[0];
        if (file) {
          const error = validateImage(file);
          if (error) {
            setErrors((prev) => ({ ...prev, [name]: [error] }));
            return;
          }
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
        const errors = fileArray.map(validateImage).filter(Boolean);
        if (errors.length) {
          setErrors((prev) => ({ ...prev, [name]: errors }));
          return;
        }
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
            [name]: fileArray,
            ImagePathPreviews: results,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors trước khi kiểm tra
    setLoading(true); // Set loading to true when starting the submit

    // Gọi validateForm để kiểm tra tính hợp lệ
    if (!validateForm()) {
      setLoading(false); // Nếu không hợp lệ, dừng loading
      return; // Dừng lại nếu có lỗi
    }

    const formData = new FormData();
    for (const key in productData) {
      if (key === "ImagePath") {
        productData[key].forEach((file, index) => {
          formData.append(`ImagePath[${index}]`, file);
        });
      } else if (key === "MainImageURL") {
        formData.append(key, productData[key]);
      } else {
        formData.append(key, productData[key]);
      }
    }

    AddProduct(formData)
      .then((response) => {
        navigate("/admin/products", {
          state: {
            success: true,
            message: "Sản phẩm đã được thêm thành công!",
            newProduct: response.data,
          },
        });
      })
      .catch((err) => {
        handleError(err); // Gọi hàm xử lý lỗi
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the operation
      });
  };

  // Hàm xử lý lỗi
  const handleError = (err) => {
    console.error("Error adding product:", err);
    if (err.response && err.response.data) {
      const errorMessages = Object.keys(err.response.data).flatMap((key) => {
        return err.response.data[key];
      });
      Swal.fire(
        "Lỗi",
        errorMessages.join(", ") || "Đã xảy ra lỗi khi thêm sản phẩm",
        "error"
      ); // Thay đổi từ toast thành swal
    } else {
      Swal.fire(
        "Lỗi",
        "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
        "error"
      ); // Thay đổi từ toast thành swal
    }
  };

  const renderImageUpload = (label, name, multiple = false) => (
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
          ) : name === "ImagePath" &&
            productData.ImagePathPreviews.length > 0 ? (
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
              <span>Thêm ảnh từ thiết bị</span>
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
            <p className="pl-1">thuộc các định dạng</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
        </div>
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>
      )}
    </div>
  );

  const validateForm = () => {
    const newErrors = {};
    if (!productData.ProductName)
      newErrors.ProductName = ["Tên sản phẩm là bắt buộc"];
    if (!productData.CategoryID)
      newErrors.CategoryID = ["Danh mục là bắt buộc"];
    if (!productData.Price) newErrors.Price = ["Giá là bắt buộc"];
    if (!productData.MainImageURL)
      newErrors.MainImageURL = ["Ảnh chính là bắt buộc"];

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateImage = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return "Chỉ chấp nhận file ảnh định dạng JPEG, PNG hoặc GIF";
    }

    if (file.size > maxSize) {
      return "Kích thước file không được vượt quá 10MB";
    }

    return null;
  };

  const renderCategorySelect = () => (
    <div className="mb-4 relative">
      <button
        type="button"
        className="w-full px-2.5 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {productData.CategoryID
          ? categories.find((cat) => cat.CategoryID === productData.CategoryID)
              ?.CategoryName
          : "Chọn danh mục"}
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
        <p className="text-red-500 text-xs mt-1">{errors.CategoryID[0]}</p>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">TẠO SẢN PHẨM MỚI</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <Input
              label="Tên sản phẩm"
              name="ProductName"
              value={productData.ProductName}
              onChange={handleChange}
            />
            {errors.ProductName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.ProductName[0]}
              </p>
            )}
          </div>
          {renderCategorySelect()}
          <div className="mb-4">
            <Input
              label="Giá"
              name="Price"
              type="number"
              value={Math.floor(productData.Price)}
              onChange={handleChange}
            />
            {errors.Price && (
              <p className="text-red-500 text-xs mt-1">{errors.Price[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <Input
              label="Giá bán"
              name="SalePrice"
              type="number"
              value={Math.floor(productData.SalePrice)}
              onChange={handleChange}
            />
            {errors.SalePrice && (
              <p className="text-red-500 text-xs mt-1">{errors.SalePrice[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Tải lên hình ảnh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                {renderImageUpload("Ảnh chính", "MainImageURL")}
              </div>
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                {renderImageUpload("Hình ảnh bổ sung", "ImagePath", true)}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <Textarea
              label="Mô tả ngắn"
              name="ShortDescription"
              value={productData.ShortDescription}
              onChange={handleChange}
              rows={2}
            />
            {errors.ShortDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.ShortDescription[0]}
              </p>
            )}
          </div>
          <div className="mb-4">
            <Textarea
              label="Mô tả"
              name="Description"
              value={productData.Description}
              onChange={handleChange}
              rows={4}
            />
            {errors.Description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Description[0]}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <Link
              className="bg-blue-400 text-white px-4 py-2 rounded-md"
              to="/admin/products"
            >
              Danh sách sản phẩm
            </Link>
            <Button type="submit" color="green" disabled={loading}>
              {loading ? "Đang tải..." : "Thêm sản phẩm"}
            </Button>
          </div>
        </form>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex items-center">
            <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
            <span className="ml-4 text-white text-lg font-semibold">
              Đang khởi tạo sản phẩm, vui lòng chờ...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProducts;
