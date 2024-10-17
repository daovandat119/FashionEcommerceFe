import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { UpdateCategory, GetCategoryById } from "../service/api_service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateCategoryComponent = () => {
  const [CategoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { CategoryID } = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await GetCategoryById(CategoryID);
        console.log(response)
        if (response.data.CategoryName) {
          
          setCategoryName(response.data.CategoryName);
        } else {
          throw new Error("Dữ liệu danh mục không hợp lệ");
        }
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
        setError("Không thể tải dữ liệu danh mục. Vui lòng thử lại sau.");
        toast.error("Không thể tải dữ liệu danh mục");
      }
    };

    if (CategoryID) {
      fetchCategory();
    } else {
      setError("ID danh mục không hợp lệ");
    }
  }, [CategoryID]);

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setError("");

    if (!CategoryName.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }

    try {
      const response = await UpdateCategory(CategoryID, CategoryName);
      if (response.data) {
        console.log("Cập nhật thành công");
         
        toast.success("Cập nhật danh mục thành công");
      } else {
        throw new Error(response.data.message || "Không thể cập nhật danh mục");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật danh mục:", err);
      setError(err.message || "Đã xảy ra lỗi khi cập nhật danh mục");
      toast.error("Lỗi cập nhật: " + (err.message || "Đã xảy ra lỗi"));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">CẬP NHẬT DANH MỤC</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleUpdateCategory} className="space-y-6">
          <div>
            <label
              htmlFor="CategoryName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              UPDATE CATEGORY
            </label>
            <input
              placeholder="edit category"
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
              LIST CATEGORY
            </Link>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              UPDATE CATEGORY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategoryComponent;
