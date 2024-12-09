/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetProductById,
  ListColors,
  ListSizes,
  GetProductVariants,
} from "../service/api_service";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon } from "@heroicons/react/24/outline";
import { FaSpinner } from "react-icons/fa";

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
  const [selectedVariantQuantity, setSelectedVariantQuantity] = useState(0);

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
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không tìm thấy thông tin sản phẩm",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/admin/products"); // Điều hướng sau khi người dùng nhấn OK
          });
        }

        const [colorsRes, sizesRes, variantsRes] = await Promise.all([
          ListColors(1),
          ListSizes(1),
          GetProductVariants(id),
        ]);

        setColors(colorsRes.data || []);
        setSizes(sizesRes.data || []);
        setVariants(variantsRes.data || []);

        if (variants.length > 0) {
          setSelectedVariantQuantity(variants[0].Quantity);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải thông tin sản phẩm",
          confirmButtonText: "OK",
        });
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
        setSelectedVariantQuantity(variant.Quantity);
      }
    } else {
      setCurrentPrice(originalPrice);
      if (variants.length > 0) {
        setSelectedVariantQuantity(variants[0].Quantity);
      }
    }
  }, [selectedColor, selectedSize, variants, originalPrice]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
        <span className="ml-4 text-lg">
          Đang tải thông tin sản phẩm, vui lòng chờ...
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex relative flex-col md:flex-row p-4 w-full">
        <button
          onClick={() => navigate("/admin/products")}
          className="absolute top-0 left-0 bg-black text-white px-4 py-2 rounded-br-lg"
        >
          Quay lại danh sách sản phẩm
        </button>
        <div className="flex w-[70%]">
          <div className="flex flex-col  w-[20%]">
            {imagePaths.map((image, index) => (
              <img
                key={index}
                src={image.trim()}
                alt={`Image Path ${index + 1}`}
                className="w-[100%] h-auto border-2 border-gray-300 object-cover "
              />
            ))}
          </div>
          <div className="flex w-[80%]">
            {product && product.MainImageURL && (
              <img
                src={product.MainImageURL}
                alt={product.ProductName}
                className="w-[100%] h-auto object-cover border-2 border-gray-300"
              />
            )}
          </div>
        </div>
        <div className=" w-[40%]  right-0 top-7 z-10 px-3">
          <h1 className="text-4xl flex items-center justify-between font-bold">
            {product.ProductName}{" "}
            <p className="text-sm text-gray-500 flex gap-2  items-center">
              <span className="material-icons">
                <EyeIcon className="h-4 w-4" />
              </span>
              {product.ViewCount || "Chưa có lượt xem "}
            </p>
          </h1>
          <p className="text-lg flex items-center justify-between py-2 gap-2 text-gray-500">
            <p className="flex items-center gap-2">
              Đánh giá trung bình: <Star rating={product.Rating || 0} />
            </p>
            <p className="text-lg text-gray-500">
              Đã bán: {product.SoldCount || 0}
            </p>
          </p>
          <div className="flex items-center">
            <p className="text-2xl flex font-se items-center gap-2 text-red-700">
              <p className="font-bold text-lg text-black border-b border-black">
                Giá bán :
              </p>
              {Math.floor(currentPrice) } VND
            </p>
            {currentPrice < originalPrice && (
              <p className="text-sm text-gray-500 line-through ml-2">
                {Math.floor(originalPrice)} VND
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
          <h3 className="my-3 font-semibold text-2xl">Màu sắc</h3>
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
                  className={`w-8 h-8 flex-shrink-0 rounded-full cursor-pointer border-2 border-black ${
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

          <h3 className="my-3 font-semibold text-2xl">Kích thước</h3>
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
                  className={`cursor-pointer py-2 px-3 rounded-sm text-sm font-medium border-2 border-black ${
                    selectedSize?.SizeID === size.SizeID
                      ? "bg-black text-white transform scale-125 border-2 border-white"
                      : "bg-white text-black"
                  }`}
                  htmlFor={`size-${size.SizeID}`}
                >
                  {size.SizeName}
                </label>
              </div>
            ))}
          </div>
          <p className="text-base text-black mt-2">
            Số lượng: {selectedVariantQuantity}
          </p>

          <p className="text-lg my-3 text-black font-semibold">
            Mô tả ngắn: {product.ShortDescription || "Chưa có mô tả"}
          </p>
          <div className="flex justify-between items-center "></div>
        </div>
      </div>

      <div className="mt-4 w-[95%] mx-auto flex justify-center">
        <button
          onClick={() => setShowReviews(false)}
          className={`mr-4 ${showReviews ? "" : "font-bold"}`}
        >
          <p className="text-2xl font-bold border-2 border-gray-300 px-2 py-1 rounded-lg">
            Mô tả{" "}
          </p>
        </button>
        <button
          onClick={() => setShowReviews(true)}
          className={`${showReviews ? "font-bold" : ""}`}
        >
          <p className="text-2xl font-bold border-2 border-gray-300 px-2 py-1 rounded-lg">
            Đánh giá
          </p>
        </button>
      </div>

      <div className="mt-4  flex justify-center w-[95%] mx-auto  rounded-lg">
        {showReviews ? (
          <div className="w-full py-5 ">
            <ReviewsProducts />
          </div>
        ) : (
          <div className="w-full py-5">
            <AdditionalInfo />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetailAdmin;
