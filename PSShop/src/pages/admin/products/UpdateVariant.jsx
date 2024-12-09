import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import { GetProductVariantById, UpdateProductVariant } from "../service/api_service";

const UpdateVariant = () => {
  const { VariantID } = useParams();
  const navigate = useNavigate();
  const [variantData, setVariantData] = useState({
    ProductID: "",
    Price: "",
    Quantity: "",
    ColorID: "",
    SizeID: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVariantData = async () => {
      try {
        const response = await GetProductVariantById(VariantID);
        setVariantData({
          ProductID: response.data.ProductID,
          Price: response.data.Price,
          Quantity: response.data.Quantity,
          ColorID: response.data.ColorID,
          SizeID: response.data.SizeID,
          ColorName: response.data.ColorName,
          SizeName: response.data.SizeName,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải thông tin biến thể",
          confirmButtonText: "Đóng",
        });
      }
    };

    fetchVariantData();
  }, [VariantID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVariantData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra các trường bắt buộc
    if (!variantData.Quantity || variantData.Quantity <= 0) {
      Swal.fire({
        icon: "error",
        title: "Lỗi nhập liệu",
        text: "Vui lòng nhập số lượng hợp lệ",
        confirmButtonText: "Đóng",
      });
      return;
    }

    if (!variantData.Price || variantData.Price <= 0) {
      Swal.fire({
        icon: "error",
        title: "Lỗi nhập liệu",
        text: "Giá không hợp lệ",
        confirmButtonText: "Đóng",
      });
      return;
    }

    try {
      const response = await UpdateProductVariant({
        VariantID: variantData.VariantID,
        ProductID: variantData.ProductID,
        SizeID: variantData.SizeID,
        ColorID: variantData.ColorID,
        Quantity: variantData.Quantity,
        Price: variantData.Price,
      });

      if (response && response.data) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: response.data.message || "Cập nhật biến thể thành công!",
          confirmButtonText: "Đóng",
        }).then(() => {
          navigate(`/admin/products/edit/${ProductID}`); // Chuyển hướng sau khi cập nhật thành công
        });
      } else {
        throw new Error("Không thể cập nhật biến thể");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.response.data.message || "Đã xảy ra lỗi khi cập nhật biến thể",
          confirmButtonText: "Đóng",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi không xác định",
          text: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
          confirmButtonText: "Đóng",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Chỉnh sửa biến thể</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Màu sắc</label>
            <span className="border border-gray-300 rounded p-2 w-full block bg-gray-100">
              {variantData.ColorName}
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kích thước</label>
            <span className="border border-gray-300 rounded p-2 w-full block bg-gray-100">
              {variantData.SizeName}
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Giá</label>
            <input
              type="number"
              name="Price"
              value={variantData.Price}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Số lượng</label>
            <input
              type="number"
              name="Quantity"
              value={variantData.Quantity}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>} {/* Hiển thị thông báo lỗi */}
          </div>
          <button
            type="submit"
            className="col-span-2 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Cập nhật
          </button>
        </form>
        <div className="mt-4 flex justify-between">
          <Link
            to={`/admin/products/edit/${variantData.ProductID}`} // Đường dẫn đến trang Edit Products với ProductID
            className="w-full bg-blue-500 text-center text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Quay về sản phẩm
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateVariant;
