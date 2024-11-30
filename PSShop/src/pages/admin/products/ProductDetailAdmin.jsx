/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetProductById,
  ListColors,
  ListSizes,
  GetProductVariants,
} from "../service/api_service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Star from "../../../components/common/Star";
import ReviewsProducts from "./ReviewProducts";
import AdditionalInfo from "../../../components/products-detail/AdditionalInfo";

const ProductDetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [imagePaths, setImagePaths] = useState([]);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productRes = await GetProductById(
          id,
          localStorage.getItem("token")
        );
        if (productRes && productRes.success) {
          setProduct(productRes.data);
          setCurrentPrice(productRes.data.Price);
          setOriginalPrice(productRes.data.Price);
          setAdditionalImages(productRes.data.AdditionalImages || []);
          setImagePaths(
            productRes.data.image_paths
              ? productRes.data.image_paths.split(",")
              : []
          );
        } else {
          toast.error("Không tìm thấy thông tin sản phẩm");
          navigate("/admin/products");
        }

        const [colorsRes, sizesRes, variantsRes] = await Promise.all([
          ListColors(1),
          ListSizes(1),
          GetProductVariants(id),
        ]);

        setColors(colorsRes.data || []);
        setSizes(sizesRes.data || []);
        setVariants(variantsRes.data || []);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variant = variants.find(
        (variant) =>
          variant.ColorID === selectedColor.ColorID &&
          variant.SizeID === selectedSize.SizeID
      );
      if (variant) {
        setCurrentPrice(variant.Price);
      }
    } else {
      setCurrentPrice(originalPrice);
    }
  }, [selectedColor, selectedSize, variants, originalPrice]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row p-4">
        <div className="flex flex-row-reverse w-[80%]">
          <div>
            {product && product.MainImageURL && (
              <img
                src={product.MainImageURL}
                alt={product.ProductName}
                className="w-[400px] h-[400px] object-cover"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            {imagePaths.map((image, index) => (
              <img
                key={index}
                src={image.trim()}
                alt={`Image Path ${index + 1}`}
                className="w-32 h-32 mr-2 object-cover cursor-pointer"
              />
            ))}
          </div>
        </div>
        <div className="md:w-1/2 md:pl-4">
          <h1 className="text-2xl font-bold">{product.ProductName}</h1>
          <div className="flex items-center">
            <p className="text-lg text-blue-600">{currentPrice} VND</p>
            {currentPrice < originalPrice && (
              <p className="text-sm text-gray-500 line-through ml-2">
                {originalPrice} VND
              </p>
            )}
            {currentPrice < originalPrice && (
              <span className="bg-yellow-200 text-sm text-black rounded-full px-2 ml-2">
                -
                {Math.round(
                  ((originalPrice - currentPrice) / originalPrice) * 100
                )}
                %
              </span>
            )}
          </div>
          <p className="text-sm flex items-center text-gray-500">
            Đánh giá trung bình: <Star rating={product.Rating || 0} />
          </p>
          <p className="text-sm text-gray-500">
            Tổng số đã bán: {product.total_sold || 0}
          </p>
          <p className="text-sm text-gray-500">
            Lượt xem: {product.Views || 0}
          </p>
          <p className="text-sm text-gray-500">
            Mô tả ngắn: {product.ShortDescription || "Chưa có mô tả"}
          </p>

          <h3 className="mt-4 font-semibold">Màu sắc</h3>
          <div className="flex gap-3">
            {colors.map((color) => (
              <div key={color.ColorID} className="relative">
                <input
                  type="radio"
                  name="color"
                  id={`color-${color.ColorID}`}
                  className="hidden"
                  onChange={() => setSelectedColor(color)}
                />
                <label
                  className={`w-8 h-8 flex-shrink-0 rounded-full cursor-pointer border-2 border-gray-300 ${
                    selectedColor?.ColorID === color.ColorID
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  htmlFor={`color-${color.ColorID}`}
                  style={{ backgroundColor: color.ColorName }}
                  title={color.ColorName}
                ></label>
              </div>
            ))}
          </div>

          <h3 className="mt-4 font-semibold">Kích thước</h3>
          <div className="flex gap-3">
            {sizes.map((size) => (
              <div key={size.SizeID} className="relative">
                <input
                  type="radio"
                  name="size"
                  id={`size-${size.SizeID}`}
                  className="hidden"
                  onChange={() => setSelectedSize(size)}
                />
                <label
                  className={`cursor-pointer py-2 px-4 rounded-md text-sm font-medium border border-gray-300 ${
                    selectedSize?.SizeID === size.SizeID
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  htmlFor={`size-${size.SizeID}`}
                >
                  {size.SizeName}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setShowReviews(false)}
          className={`mr-4 ${!showReviews ? "font-bold" : ""}`}
        >
          Mô tả
        </button>
        <button
          onClick={() => setShowReviews(true)}
          className={`${showReviews ? "font-bold" : ""}`}
        >
          Đánh giá
        </button>
      </div>

      <div className="mt-4 flex justify-center">
        {showReviews ? <ReviewsProducts /> : <AdditionalInfo />}
      </div>
    </>
  );
};

export default ProductDetailAdmin;
