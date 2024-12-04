import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddColor } from "../service/api_service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddColorComponent = () => {
  const [ColorName, setColorName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSaveColor = (e) => {
    e.preventDefault();
    setError("");

    if (!ColorName.trim()) {
      setError("Tên màu không được để trống");
      return;
    }

    AddColor(ColorName)
      .then(response => {
        console.log("Màu đã được thêm:", response);
        if (response && response.data) {
          // Điều hướng về trang danh sách với thông báo thành công
          navigate("/admin/colors", { 
            state: { 
              success: true, 
              message: "Thêm màu mới thành công!", 
              newColor: response.data // Thêm thông tin màu mới vào state
            } 
          });
        } else {
          setError("Không thể thêm màu. Vui lòng thử lại.");
        }
      })
      .catch(err => {
        console.error("Lỗi khi thêm màu:", err);
        if (err.response && err.response.data) {
          toast.error(err.response.data.ColorName[0] || "Đã xảy ra lỗi khi thêm màu");
        } else {
          toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
        }
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">TẠO MÀU SẮC MỚI</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSaveColor} className="space-y-6">
          <div>
            <label
              htmlFor="ColorName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Màu sắc
            </label>
            <input
              placeholder="Nhập tên màu sắc"
              id="ColorName"
              className="border-2 p-2 w-full rounded-xl"
              type="text"
              value={ColorName}
              onChange={(e) => setColorName(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-between items-center">
            <Link
              className="bg-blue-400 text-white px-4 py-2 rounded-md"
              to="/admin/colors"
            >
              Quay lại màu sắc
            </Link>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              THÊM MÀU SẮC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddColorComponent;
