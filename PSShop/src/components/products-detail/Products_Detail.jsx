import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContextElement } from "../../context/Context";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Description from "./Description";
import Star from "../common/Star";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [variantInfo, setVariantInfo] = useState(null);
  const [variantPrice, setVariantPrice] = useState(null);
  const {
    addProductToCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isLoadingWishlist,
    fetchWishlistItems,
  } = useContextElement();

  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isExceedQuantity, setIsExceedQuantity] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);

  useEffect(() => {
    // Cuộn lên đầu trang khi component được tải
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Gọi API cho sản phẩm
        const productRes = await axios.get(
          `http://127.0.0.1:8000/api/products/${id}`
        );
        if (productRes.data.success) {
          setProduct(productRes.data.data);
        } else {
          // Nếu không tìm thấy sản phẩm, chuyển hướng đến trang Not Found
          navigate("/notfound");
        }

        // Gọi fetchWishlistItems chỉ một lần
        const token = localStorage.getItem("token");
        if (token) {
          await fetchWishlistItems();
        }

        // Gọi API cho sizes và colors
        const [sizesRes, colorsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/sizes"),
          axios.get("http://127.0.0.1:8000/api/colors"),
        ]);
        setSizes(sizesRes.data.data);
        setColors(colorsRes.data.data);
      } catch (error) {
        console.error("Error:", error);
        navigate("*"); // Chuyển hướng đến trang Not Found nếu có lỗi
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [id, fetchWishlistItems, navigate]);
   // Giữ nguyên dependency array
  useEffect(() => {
    if (product && typeof isInWishlist === "function") {
      const status = isInWishlist(product.ProductID);
      setInWishlist(status);

      // Kiểm tra localStorage
      const isFavorited = localStorage.getItem(`wishlist_${product.ProductID}`);
      if (isFavorited) {
        setInWishlist(true);
      }
    }
  }, [product, isInWishlist]);

  const handleWishlistClick = async () => {
    if (!product || wishlistLoading) return;

    try {
      setWishlistLoading(true);

      if (!localStorage.getItem("token")) {
        toast.warning("Vui lòng đăng nhập để sử dụng tính năng này");
        return;
      }

      if (inWishlist) {
        await removeFromWishlist(product.ProductID);
        setInWishlist(false);
        localStorage.removeItem(`wishlist_${product.ProductID}`);
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        await addToWishlist(product.ProductID);
        setInWishlist(true);
        localStorage.setItem(`wishlist_${product.ProductID}`, true);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (error) {
      console.error("Error handling wishlist:", error);
      toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setWishlistLoading(false);
    }
  };

  const checkProductVariant = useCallback(async () => {
    if (!selectedSize || !selectedColor || !product) return null;

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/product-variants/getVariantByID",
        {
          ProductID: product.ProductID,
          SizeID: selectedSize.SizeID,
          ColorID: selectedColor.ColorID,
        }
      );

      if (response.data.message === "Success" && response.data.data) {
        return {
          ...response.data.data,
          Quantity: parseInt(response.data.data.Quantity) || 0, // Convert to number
          Price: parseFloat(response.data.data.Price) || product.Price, // Convert to number
        };
      }
      return null;
    } catch (error) {
      console.error("Lỗi khi kiểm tra biến thể:", error);
      return null;
    }
  }, [selectedSize, selectedColor, product]);


  const handleAddToCart = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.warning("Vui lòng chọn kích thước và màu sắc");
      return;
    }

    setIsChecking(true);
    try {
      const result = await addProductToCart(
        product.ProductID,
        selectedColor.ColorID,
        selectedSize.SizeID,
        quantity
      );
      
      if (result.success) {
        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const checkVariant = async () => {
      if (selectedSize && selectedColor && product) {
        setIsChecking(true);
        try {
          const variant = await checkProductVariant();

          if (variant && variant.Quantity > 0) {
            // Kiểm tra số lượng > 0
            setVariantInfo(variant);
            setVariantPrice(variant.Price);
          } else {
            setVariantInfo({
              Quantity: 0,
              Price: product.Price,
            });
            setVariantPrice(product.Price);
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra biến thể:", error);
          setVariantInfo({
            Quantity: 0,
            Price: product.Price,
          });
          setVariantPrice(product.Price);
        } finally {
          setIsChecking(false);
        }
      } else {
        setVariantInfo(null);
        setVariantPrice(product?.Price || null);
      }
    };
    checkVariant();
  }, [selectedSize, selectedColor, product, checkProductVariant]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return; // Không cho phép số lượng âm
    setQuantity(newQuantity);
    // Kiểm tra xem số lượng có vượt quá số lượng trong kho không
    if (variantInfo && newQuantity > variantInfo.Quantity) {
      setOutOfStock(true); // Đặt trạng thái hết hàng
    } else {
      setOutOfStock(false); // Reset trạng thái hết hàng
    }
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <section className="product-single container">
      <ToastContainer />
      <div className="flex flex-col lg:flex-row">
        {/* Phần hình ảnh sản phẩm */}
        <div className="product-single__media mt-6 vertical-thumbnail product-media-initialized  ">
          <div className="swiper-container mb-3 ml-2">
            <img
              loading="lazy"
              className="h-[615px] w-full object-cover"
              src={product.MainImageURL}
              alt="image"
            />
          </div>
          <div className="product-single__thumbnail">
            {product.image_paths.split(",").map((image, index) => (
              <img
                key={index}
                loading="lazy"
                className="h-[200px] w-[240px] mb-2 cursor-pointer border border-gray-300 rounded"
                src={image.trim()}
                alt={`image-${index}`}
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="lg:w-1/2 bg-white p-4">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            {product.ProductName}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-semibold text-blue-600">
              {Math.floor(variantPrice || product?.Price || 0)} VND
            </span>
            {variantPrice && variantPrice !== product?.Price && (
              <span className="text-sm text-gray-500 line-through">
                {Math.floor(product?.Price)} VND
              </span>
            )}
            {product.discount_percentage && (
              <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                -{product.discount_percentage}%
              </span>
            )}
          </div>

          <div className="space-y-4 text-sm text-gray-700 mb-6">
            <p>
              <p className="flex items-center ">
                <span className="font-medium mr-2 text-gray-900">
                  Đánh giá trung bình:{" "}
                </span>{" "}
                <Star stars={product.average_rating} />{" "}
              </p>
            </p>
            <p>
              <span className="font-medium text-gray-900">Tổng số đã bán:</span>{" "}
              {product.total_sold}
            </p>
            <p>
              <span className="font-medium text-gray-900">Lượt xem:</span>{" "}
              {product.Views}
            </p>
            <p className="leading-relaxed">
              <span className="font-medium text-gray-900">Mô tả ngắn:</span>{" "}
              {product.ShortDescription}
            </p>
          </div>

          {/* Chọn kích cỡ và màu sắc */}
          <form onSubmit={handleAddToCart} className="space-y-6 mt-4">
            {/* Chọn kích cỡ */}
            <div className="product-single__swatches">
              <label className="font-semibold text-gray-800 mb-2 block">
                Kích cỡ
              </label>
              <div className="swatch-list flex gap-3">
                {sizes.map((size) => (
                  <React.Fragment key={size.SizeID}>
                    <input
                      type="radio"
                      name="size"
                      id={`size-${size.SizeID}`}
                      className="hidden"
                      onChange={() => setSelectedSize(size)}
                    />
                    <label
                      className={`cursor-pointer py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 
                border border-gray-300 
                ${
                  selectedSize?.SizeID === size.SizeID
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-700"
                }`}
                      htmlFor={`size-${size.SizeID}`}
                    >
                      {size.SizeName}
                    </label>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Chọn màu sắc */}
            <div className="product-swatch color-swatches mt-4">
              <label className="font-semibold text-gray-800 mb-2 block">
                Màu sắc
              </label>
              <div className="swatch-list flex gap-3">
                {colors.map((color) => (
                  <div key={color.ColorID} className="relative">
                    <input
                      type="radio"
                      name="color"
                      id={`color-${color.ColorID}`}
                      className="hidden peer"
                      onChange={() => setSelectedColor(color)}
                    />
                    <label
                      className={`w-8 h-8 flex-shrink-0 rounded-full cursor-pointer transition-all duration-200 
                border-2 border-gray-300 
                peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500 peer-checked:ring-offset-2
                hover:border-gray-400 hover:ring-2 hover:ring-gray-400`}
                      htmlFor={`color-${color.ColorID}`}
                      title={color.ColorName}
                      style={{ backgroundColor: color.ColorName }}
                    ></label>
                  </div>
                ))}
              </div>
            </div>

            {/* Chọn số lượng */}
            <div className="flex items-center gap-4 mt-6">
              <label className="text-sm font-medium text-gray-700">
                Số lượng
              </label>
              <div className="relative flex items-center w-32 h-10 border rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="absolute left-0 w-8 h-full flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-minus text-xs"></i>
                </button>

                <input
                  type="number"
                  name="quantity"
                  min="1"
                  className="w-full h-full text-center text-gray-700 focus:outline-none"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                />

                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={outOfStock}
                  className={`absolute right-0 w-8 h-full flex items-center justify-center text-gray-500 ${
                    outOfStock ? "opacity-50 cursor-not-allowed" : "hover:text-gray-700"
                  }`}
                >
                  <i className="fas fa-plus text-xs"></i>
                </button>
              </div>
            </div>

            {/* Thêm vào giỏ hàng và danh sách yêu thích */}
            <div className="flex items-center gap-4 mt-6">
              <button
                type="submit"
                disabled={
                  isChecking ||
                  (variantInfo && variantInfo.Quantity === 0) ||
                  outOfStock
                }
                className={`flex-1 px-6 py-3 text-sm font-medium text-white rounded-lg transition-all duration-300 ${
                  isChecking ||
                  (variantInfo && variantInfo.Quantity === 0) ||
                  outOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-dark"
                }`}
              >
                {isChecking
                  ? "Đang kiểm tra..."
                  : outOfStock
                  ? "Hết hàng"
                  : "Thêm vào giỏ"}
              </button>

              <button
                type="button"
                onClick={handleWishlistClick}
                disabled={wishlistLoading || isLoadingWishlist}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 border-red-500 transition-all duration-300 ${
                  inWishlist ? "bg-red-500" : "bg-white hover:scale-105"
                }`}
              >
                <i
                  className={`fas text-xl ${
                    wishlistLoading || isLoadingWishlist
                      ? "fa-spinner fa-spin"
                      : "fa-heart"
                  } ${inWishlist ? "text-white" : "text-red-500"}`}
                />
              </button>
            </div>

            {/* Thông tin kho */}
            {(isChecking || variantInfo) && (
              <div className="mt-4">
                {isChecking ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <i className="fas fa-spinner fa-spin mr-2"></i>Đang kiểm
                    tra...
                  </span>
                ) : (
                  variantInfo && (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        outOfStock
                          ? "bg-red-100 text-red-800"
                          : variantInfo.Quantity > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {outOfStock ? (
                        <>
                          <i className="fas fa-exclamation-circle mr-2"></i>Vượt
                          quá số lượng trong kho
                        </>
                      ) : variantInfo.Quantity > 0 ? (
                        <>
                          <i className="fas fa-check-circle mr-2"></i>Có thể mua: {variantInfo.Quantity}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-times-circle mr-2"></i>Hết hàng
                        </>
                      )}
                    </span>
                  )
                )}
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="product-single__details-tab">
        <ul className="nav nav-tabs" id="myTab1" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              className="nav-link nav-link_underscore active"
              id="tab-description-tab"
              data-bs-toggle="tab"
              href="#tab-description"
              role="tab"
              aria-controls="tab-description"
              aria-selected="true"
            >
              Mô tả
            </a>
          </li>
          {/* <li className="nav-item" role="presentation">
            <a
              className="nav-link nav-link_underscore"
              id="tab-additional-info-tab"
              data-bs-toggle="tab"
              href="#tab-additional-info"
              role="tab"
              aria-controls="tab-additional-info"
              aria-selected="false"
            >
              Thông tin bổ sung
            </a>
          </li> */}
          <li className="nav-item" role="presentation">
            <a
              className="nav-link nav-link_underscore"
              id="tab-reviews-tab"
              data-bs-toggle="tab"
              href="#tab-reviews"
              role="tab"
              aria-controls="tab-reviews"
              aria-selected="false"
            >
              Đánh giá
            </a>
          </li>
        </ul>
        <div className="tab-content">
          <div
            className="tab-pane fade show active"
            id="tab-description"
            role="tabpanel"
            aria-labelledby="tab-description-tab"
          >
            <Description
              description={{
                title: product.ProductName,
                mainContent: product.Description,
                features: {
                  title: "Đặc điểm sản phẩm",
                  items: product.Features ? product.Features.split("\n") : [],
                },
                details: {
                  title: "Thông tin chi tiết",
                  items: [
                    `Giá: ${product.Price}VND`,
                    `Danh mục: ${product.category_name || "Chưa cập nhật"}`,
                  ],
                },
                additional: {
                  title: "Thông tin bổ sung",
                  content:
                    product.AdditionalInfo || "Không có thông tin bổ sung",
                },
              }}
            />
          </div>
          <div
            className="tab-pane fade"
            id="tab-additional-info"
            role="tabpanel"
            aria-labelledby="tab-additional-info-tab"
          >
            <AdditionalInfo product={product} />
          </div>
          <div
            className="tab-pane fade"
            id="tab-reviews"
            role="tabpanel"
            aria-labelledby="tab-reviews-tab"
          >
            <Reviews productId={product.ProductID} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
