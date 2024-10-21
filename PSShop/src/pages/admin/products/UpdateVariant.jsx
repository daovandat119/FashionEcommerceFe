import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
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
        toast.error("Không thể tải thông tin biến thể");
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
      setError("Vui lòng nhập số lượng");
      return;
    }

    if (!variantData.Price || variantData.Price <= 0) {
      setError("Giá không hợp lệ");
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
        toast.success(response.data.message || "Cập nhật biến thể thành công!");
      } else {
        throw new Error("Không thể cập nhật biến thể");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Hiển thị thông báo lỗi từ API
        toast.error(error.response.data.message || "Đã xảy ra lỗi khi cập nhật biến thể");
      } else {
        toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">UPDATE VARIANT</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Color</label>
            <span className="border border-gray-300 rounded p-2 w-full block bg-gray-100">
              {variantData.ColorName}
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Size</label>
            <span className="border border-gray-300 rounded p-2 w-full block bg-gray-100">
              {variantData.SizeName}
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="Price"
              value={variantData.Price}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Quantity</label>
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
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            UPDATE VARIANT
          </button>
        </form>
        <div className="mt-4 flex justify-between">
          <Link
            to={`/admin/products/edit/${variantData.ProductID}`} // Đường dẫn đến trang Edit Products với ProductID
            className="w-full bg-blue-500 text-center text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            RETURN TO PRODUCTS
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateVariant;
