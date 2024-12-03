import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { GetColorById, UpdateColor } from "../service/api_service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateColorComponent = () => {
  const [ColorName, setColorName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { ColorID } = useParams();

  useEffect(() => {
    const fetchColor = () => {
      GetColorById(ColorID)
        .then(response => {
          if (response.data.ColorName) {
            setColorName(response.data.ColorName);
          } else {
            throw new Error("Dữ liệu màu sắc không hợp lệ");
          }
        })
        .catch(err => {
          console.error("Lỗi khi tải màu sắc:", err);
          setError("Không thể tải dữ liệu màu sắc. Vui lòng thử lại sau.");
          toast.error("Không thể tải dữ liệu màu sắc");
        });
    };

    if (ColorID) {
      fetchColor();
    } else {
      setError("ID màu sắc không hợp lệ");
    }
  }, [ColorID]);

  const handleUpdateColor = (e) => {
    e.preventDefault();
    setError("");

    if (!ColorName.trim()) {
      setError("Tên màu sắc không được để trống");
      return;
    }

    UpdateColor(ColorID, ColorName)
      .then(response => {
        if (response && response.data) {
          toast.success("Cập nhật màu sắc thành công", {
            onClose: () => navigate("/admin/colors"),
          });
        } else {
          throw new Error(response.data.message || "Không thể cập nhật màu sắc");
        }
      })
      .catch(err => {
        console.error("Lỗi khi cập nhật màu sắc:", err);
        // Hiển thị thông báo lỗi từ API
        if (err.response && err.response.data) {
          toast.error(err.response.data.ColorName[0] || "Đã xảy ra lỗi khi cập nhật màu sắc");
        } else {
          toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
        }
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">CẬP NHẬT MÀU SẮC</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleUpdateColor} className="space-y-6">
          <div>
            <label
              htmlFor="ColorName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Nhập màu sắc
            </label>
            <input
              placeholder="Nhập màu sắc muốn cập nhật"
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
              Cập nhật màu sắc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateColorComponent;
