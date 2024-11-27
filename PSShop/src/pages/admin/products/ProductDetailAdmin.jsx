import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  GetProductById,
  GetProductVariants,
  ListSizes,
  ListColors,
} from "../service/api_service"; // Import các hàm lấy dữ liệu
import { ToastContainer, toast } from "react-toastify";
import Star from "../../../components/common/Star";

const ProductDetailAdmin = () => {
  const { id } = useParams(); // Lấy ProductID từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [variantPrice, setVariantPrice] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await GetProductById(
          id,
          localStorage.getItem("token")
        );
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Không thể lấy thông tin sản phẩm");
        setLoading(false);
      }
    };

    const fetchVariants = async () => {
      try {
        const response = await GetProductVariants(id);
        setVariants(response.data);
      } catch (error) {
        console.error("Error fetching product variants:", error);
        toast.error("Không thể lấy thông tin biến thể sản phẩm");
      }
    };

    const fetchSizes = async () => {
      try {
        const response = await ListSizes(1); // Lấy trang đầu tiên
        setSizes(response.data);
      } catch (error) {
        console.error("Error fetching sizes:", error);
        toast.error("Không thể lấy thông tin kích thước");
      }
    };

    const fetchColors = async () => {
      try {
        const response = await ListColors(1); // Lấy trang đầu tiên
        setColors(response.data);
      } catch (error) {
        console.error("Error fetching colors:", error);
        toast.error("Không thể lấy thông tin màu sắc");
      }
    };

    fetchProduct();
    fetchVariants();
    fetchSizes();
    fetchColors();
  }, [id]);

  useEffect(() => {
    if (selectedSize && selectedColor) {
      const variant = variants.find(
        (variant) =>
          variant.SizeID === selectedSize.SizeID &&
          variant.ColorID === selectedColor.ColorID
      );
      setVariantPrice(variant ? variant.Price : null);
    } else {
      setVariantPrice(null);
    }
  }, [selectedSize, selectedColor, variants]);

  if (loading) {
    return <div className="text-center mt-8">Đang tải...</div>;
  }

  const imagePaths = product.image_paths ? product.image_paths.split(",") : [];

  return (
    <div className="container mx-auto my-8 p-4">
      <ToastContainer />
      <Link to="/admin/products" className="mb-4 text-blue-500">
        Trở về danh sách sản phẩm
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex gap-3">
          <div className="flex-col">
            {imagePaths.map((image, index) => (
              <img
                key={index}
                src={image.trim()}
                alt={`Phụ kiện ${index + 1}`}
                className="w-24 h-24 object-cover rounded-md shadow-md"
              />
            ))}
          </div>
          <div className=" ">
            <img
              src={product.MainImageURL}
              alt={product.ProductName}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="product-details space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {product.ProductName}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-semibold text-blue-600">
              {(variantPrice || product?.Price || 0).toLocaleString()} VND
            </span>
            {variantPrice && variantPrice !== product?.Price && (
              <span className="text-sm text-gray-500 line-through">
                {product?.Price.toLocaleString()} VND
              </span>
            )}
            <p className="text-xl text-gray-600 line-through">
              {product.Price} VND
            </p>
            {product.discount_percentage && (
              <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                -{product.discount_percentage}%
              </span>
            )}
          </div>

          {/* Giá gốc và giảm giá */}

          {/* Đánh giá */}
          <p className="flex items-center ">
            <span className="font-medium mr-2 text-gray-900">
              Đánh giá trung bình:{" "}
            </span>
            <Star stars={product.average_rating} />
          </p>

          {/* Tổng số đã bán và lượt xem */}

          <p className="text-sm text-gray-700">
            Tổng số đã bán: {product.total_sold}
          </p>
          <p className="text-sm text-gray-700">Lượt xem: {product.Views}</p>

          {/* Mô tả ngắn */}
          <p className="text-gray-700">
            Mô tả ngắn : {product.ShortDescription}
          </p>

          {/* Kích thước */}
          <div className="size-selection">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Kích thước
            </h3>
            <div className="flex gap-4 mb-4">
              {sizes.map((size) => (
                <label
                  key={size.SizeID}
                  className={`cursor-pointer py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 
                  border border-gray-300 
                  ${
                    selectedSize?.SizeID === size.SizeID
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  htmlFor={`size-${size.SizeID}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size.SizeName}
                </label>
              ))}
            </div>
          </div>

          {/* Màu sắc */}
          <div className="color-selection">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Màu sắc
            </h3>
            <div className="flex gap-4 mb-4">
              {colors.map((color) => (
                <label
                  key={color.ColorID}
                  className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-200 
                  border-2 border-gray-300 
                  ${
                    selectedColor?.ColorID === color.ColorID
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.ColorName }}
                  htmlFor={`color-${color.ColorID}`}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Giá biến thể */}
          {variantPrice !== null && (
            <div className="variant-price">
              <h3 className="text-lg font-semibold">Giá biến thể:</h3>
              <p className="text-xl text-red-500">{variantPrice} VND</p>
            </div>
          )}

          {/* Số lượng */}
          <div className="quantity-selection flex items-center gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700">
              Số lượng
            </label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Math.max(1, e.target.value))}
              className="border rounded p-2 w-16"
            />
          </div>

          {/* Nút Thêm vào giỏ */}
          <button className="btn-add-to-cart bg-black text-white px-6 py-2 rounded-md w-full hover:bg-blue-500 transition duration-200">
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailAdmin;
