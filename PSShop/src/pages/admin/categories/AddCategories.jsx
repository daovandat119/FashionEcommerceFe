import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AddCategory } from "../service/api_service";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert

//Add Category
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

      if (response) {
        // Chuyển hướng về trang danh sách danh mục với thông báo thành công và danh mục mới
        navigate("/admin/categories", {
          state: {
            success: true,
            newCategory: response.data, // Thêm thông tin danh mục mới vào state
          },
        });
        Swal.fire("Thành công!", "Thêm danh mục thành công!", "success"); // Use SweetAlert for success
      } else {
        setError("Không thể kích hoạt danh mục. Vui lòng thử lại.");
      }
    } catch (err) {
      // Hiển thị thông báo lỗi từ API
      if (err.response && err.response.data) {
        Swal.fire(
          "Lỗi!",
          err.response.data.CategoryName[0] ||
            "Đã xảy ra lỗi khi thêm danh mục",
          "error"
        ); // Use SweetAlert for error
      } else {
        Swal.fire(
          "Lỗi!",
          "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
          "error"
        ); // Use SweetAlert for error
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">TẠO DANH MỤC MỚI</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSaveCategory} className="space-y-6">
          <div>
            <label
              htmlFor="CategoryName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Tên danh mục
            </label>
            <input
              placeholder="Nhập tên danh mục"
              id="CategoryName"
              className="border-2 p-2 w-full rounded-xl"
              type="text"
              value={CategoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-between items-center">
            <Link
              className="bg-blue-400 text-white px-4 py-2 rounded-md"
              to="/admin/categories"
            >
              Quay lại danh mục
            </Link>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              THÊM DANH MỤC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryComponent;
