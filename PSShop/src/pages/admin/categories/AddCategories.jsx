import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AddCategory } from "../service/api_service";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategoryComponent = () => {
  const [CategoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setError("");

    if (!CategoryName.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }

    try {
      const response = await AddCategory(CategoryName);
      console.log("Danh mục đã được thêm:", response);
      if (response) {
        // Chuyển hướng về trang danh sách danh mục với thông báo thành công và danh mục mới
        navigate("/admin/categories", {
          state: {
            success: true,
            newCategory: response.data, // Thêm thông tin danh mục mới vào state
          },
        });
      } else {
        setError("Không thể kích hoạt danh mục. Vui lòng thử lại.");
      }
    }  catch (err) {
      // Hiển thị thông báo lỗi từ API
      if (err.response && err.response.data) {
        toast.error(err.response.data.CategoryName[0] || "Đã xảy ra lỗi khi thêm danh mục");
      } else {
        toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">ADD NEW CATEGORY</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSaveCategory} className="space-y-6">
          <div>
            <label
              htmlFor="CategoryName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              placeholder="New Category"
              id="CategoryName"
              className="border-2 p-2 w-full rounded-xl"
              type="text"
              value={CategoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-between items-center">
            <Link
              className="bg-blue-400 text-white px-4 py-2  rounded-md"
              to="/admin/categories"
            >
              List Category
            </Link>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              NEW CATEGORY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryComponent;
