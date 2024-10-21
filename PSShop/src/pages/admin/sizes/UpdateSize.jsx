import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { GetSizeById, UpdateSize } from "../service/api_service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateSizeComponent = () => {
  const [SizeName, setSizeName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { SizeID } = useParams();

  useEffect(() => {
    const fetchSize = async () => {
      try {
        const response = await GetSizeById(SizeID);
        console.log("Received data:", response);
        if (response) {
          setSizeName(response.SizeName);
        } else {
          throw new Error("Dữ liệu kích thước không hợp lệ");
        }
      } catch (err) {
        console.error("Lỗi khi tải kích thước:", err);
        setError("Không thể tải dữ liệu kích thước. Vui lòng thử lại sau.");
        toast.error("Không thể tải dữ liệu kích thước");
      }
    };

    if (SizeID) {
      fetchSize();
    } else {
      setError("ID kích thước không hợp lệ");
    }
  }, [SizeID]);

  const handleUpdateSize = async (e) => {
    e.preventDefault();
    setError("");

    if (!SizeName.trim()) {
      setError("Tên kích thước không được để trống");
      return;
    }

    try {
      const response = await UpdateSize(SizeID, SizeName);
      if (response.data) {
        console.log("Cập nhật thành công:", response.data);
        navigate("/admin/sizes", {
          state: {
            success: true,
            message: "Cập nhật kích thước thành công",
            updatedSize: { SizeID, SizeName },
          },
        });
      } else {
        throw new Error("Không thể cập nhật kích thước");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật Size:", err);
      // Hiển thị thông báo lỗi từ API
      if (err.response && err.response.data) {
        toast.error(
          err.response.data.SizeName[0] || "Đã xảy ra lỗi khi cập nhật màu sắc"
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">CẬP NHẬT KÍCH THƯỚC</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleUpdateSize} className="space-y-6">
          <div>
            <label
              htmlFor="SizeName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              UPDATE SIZE
            </label>
            <input
              placeholder="edit size"
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
              LIST SIZES
            </Link>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              UPDATE SIZE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSizeComponent;
