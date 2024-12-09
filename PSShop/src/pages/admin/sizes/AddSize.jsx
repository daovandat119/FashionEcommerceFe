import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddSize } from "../service/api_service";
import Swal from "sweetalert2";

const AddSizeComponent = () => {
  const [SizeName, setSizeName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSaveSize = (e) => {
    e.preventDefault();
    setError("");

    if (!SizeName.trim()) {
      setError("Tên kích thước không được để trống");
      return;
    }

    AddSize(SizeName)
      .then((response) => {
        console.log("Kích thước đã được thêm:", response);
        if (response && response.data) {
          Swal.fire({
            title: "Thông báo",
            text: "Thêm thành công",
            icon: "success",
            timer: 10000,
          });
          navigate("/admin/sizes");
        } else {
          setError("Không thể thêm kích thước. Vui lòng thử lại.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi thêm kích thước:", err);
        // Hiển thị thông báo lỗi từ API
        if (err.response && err.response.data) {
          Swal.fire(
            "Lỗi!",
            err.response.data.SizeName[0] ||
              "Đã xảy ra lỗi khi thêm kích thước",
            "error"
          );
        } else {
          Swal.fire(
            "Lỗi!",
            "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
            "error"
          );
        }
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">TẠO KÍCH THƯỚC MỚI</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSaveSize} className="space-y-6">
          <div>
            <label
              htmlFor="SizeName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Tên kích thước
            </label>
            <input
              placeholder="Nhập tên kích thước"
              id="SizeName"
              className="border-2 p-2 w-full rounded-xl"
              type="text"
              value={SizeName}
              onChange={(e) => setSizeName(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-between items-center">
            <Link
              className="bg-blue-400 text-white px-4 py-2 rounded-md"
              to="/admin/sizes"
            >
              Quay lại kích thước
            </Link>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              THÊM MỚI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSizeComponent;
