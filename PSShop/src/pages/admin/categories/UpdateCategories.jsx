import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UpdateCategory, GetCategoryById } from "../service/api_service";
import Swal from "sweetalert2";

const UpdateCategoryComponent = () => {
  const [CategoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const { CategoryID } = useParams();

  useEffect(() => {
    const fetchCategory = () => {
      GetCategoryById(CategoryID)
        .then((response) => {
          if (response.data) {
            setCategoryName(response.data.CategoryName);
          } else {
            throw new Error("Dữ liệu danh mục không hợp lệ");
          }
        })
        .catch((err) => {
          console.error("Lỗi khi tải danh mục:", err);
          const errorMessage =
            err.response?.data?.message ||
            "Không thể tải dữ liệu danh mục. Vui lòng thử lại sau.";
          setError(errorMessage);
          Swal.fire("Lỗi!", errorMessage, "error");
        });
    };

    if (CategoryID) {
      fetchCategory();
    } else {
      setError("ID danh mục không hợp lệ");
    }
  }, [CategoryID]);

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    setError("");

    if (!CategoryName.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }

    UpdateCategory(CategoryID, CategoryName)
      .then((response) => {
        if (response) {
          console.log("Cập nhật thành công");
          Swal.fire("Thành công!", "Cập nhật danh mục thành công", "success");
        } else {
          throw new Error(response.message || "Không thể cập nhật danh mục");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật danh mục:", err);
        const errorMessage =
          err.response?.data?.CategoryName?.[0] ||
          "Đã xảy ra lỗi khi cập nhật danh mục";
        setError(errorMessage);
        Swal.fire("Lỗi cập nhật!", errorMessage, "error");
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">CẬP NHẬT DANH MỤC</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleUpdateCategory} className="space-y-6">
          <div>
            <label
              htmlFor="CategoryName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Tên danh mục
            </label>
            <input
              placeholder="Nhập tên danh mục muốn cập nhật"
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
              Cập nhật danh mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategoryComponent;
