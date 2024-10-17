import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddSize } from "../service/api_service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSizeComponent = () => {
  const [SizeName, setSizeName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSaveSize = async (e) => {
    e.preventDefault();
    setError("");

    if (!SizeName.trim()) {
      setError("Tên kích thước không được để trống");
      return;
    }

    try {
      const response = await AddSize(SizeName);
      console.log("Kích thước đã được thêm:", response);
      if (response && response.data) {
        navigate("/admin/sizes", {
          state: { success: true, message: "Thêm kích thước mới thành công!" }
        });
      } else {
        setError("Không thể thêm kích thước. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi thêm kích thước:", err);
      setError(
        err.response?.data?.message || "Đã xảy ra lỗi khi thêm kích thước"
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">ADD NEW SIZE</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSaveSize} className="space-y-6">
          <div>
            <label
              htmlFor="SizeName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Size Name
            </label>
            <input
              placeholder="New Size"
              id="SizeName"
              className="border-2 p-2 w-full rounded-xl"
              type="text"
              value={SizeName}
              onChange={(e) => setSizeName(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-between items-center">
            <Link
              className="bg-blue-400 text-white px-4 py-2 rounded-md"
              to="/admin/sizes"
            >
              List Sizes
            </Link>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              NEW SIZE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSizeComponent;
