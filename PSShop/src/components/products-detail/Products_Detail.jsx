import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useContextElement } from "../../context/Context";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";
import Swal from "sweetalert2";
import Description from "./Description";

// Tạo axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 5000,
});

const ProductDetail = () => {
  const { id } = useParams();
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
    isAddedToCartProducts,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isLoadingWishlist,
    wishlistProducts,
    fetchWishlistItems,
  } = useContextElement();

  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  const [isExceedQuantity, setIsExceedQuantity] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Load song song các API
        const [productRes, sizesRes, colorsRes] = await Promise.all([
          api.get(`/products/${id}`), // Sửa endpoint
          api.get("/sizes"),
          api.get("/colors"),
        ]);

        if (productRes.data.success) {
          setProduct(productRes.data.data); // Cập nhật data format
          setSizes(sizesRes.data.data);
          setColors(colorsRes.data.data);
          setVariantPrice(productRes.data.data.Price); // Cập nhật price path
        }

        // Load wishlist riêng nếu có token
        const token = localStorage.getItem("token");
        if (token) {
          fetchWishlistItems().catch(console.error);
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể tải thông tin sản phẩm",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [id, fetchWishlistItems]); // Chỉ phụ thuộc vào id

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchWishlistItems();
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchWishlistItems]);

  useEffect(() => {
    if (product && !isLoadingWishlist && typeof isInWishlist === "function") {
      const status = isInWishlist(product.ProductID);
      setInWishlist(status);
    }
  }, [product, isInWishlist, isLoadingWishlist, wishlistProducts]);

  const handleWishlistClick = async () => {
    if (!product || wishlistLoading) return;

    try {
      setWishlistLoading(true);

      if (!localStorage.getItem("token")) {
        Swal.fire({
          title: "Thông báo",
          text: "Vui lòng đăng nhập để sử dụng tính năng này",
          icon: "warning",
        });
        return;
      }

      if (inWishlist) {
        await removeFromWishlist(product.ProductID);
        setInWishlist(false);
        Swal.fire({
          title: "Thành công",
          text: "Đã xóa khỏi danh sách yêu thích",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await addToWishlist(product.ProductID);
        setInWishlist(true);
        Swal.fire({
          title: "Thành công",
          text: "Đã thêm vào danh sách yêu thích",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error handling wishlist:", error);
      Swal.fire({
        title: "Lỗi",
        text: error.message || "Có lỗi xảy ra, vui lòng thử lại",
        icon: "error",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const checkProductVariant = useCallback(async () => {
    if (!selectedSize || !selectedColor || !product) return null;

    try {
      const response = await api.post("/product-variants/getVariantByID", {
        ProductID: product.ProductID,
        SizeID: selectedSize.SizeID,
        ColorID: selectedColor.ColorID,
      });

      // console.log('Variant Response:', response.data); // Debug

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
      Swal.fire({
        title: "Thông báo",
        text: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
        icon: "warning",
      });
      return;
    }

    if (!selectedSize || !selectedColor) {
      Swal.fire({
        title: "Thông báo",
        text: "Vui lòng chọn kích thước và màu sắc",
        icon: "warning",
      });
      return;
    }

    setIsChecking(true);
    try {
      const variant = await checkProductVariant();

      if (!variant) {
        Swal.fire({
          title: "Hết hàng",
          text: "Rất tiếc, sản phẩm này tạm hết hàng với màu sắc và kích thước đã chọn",
          icon: "warning",
        });
        return;
      }

      await addProductToCart(
        product.ProductID,
        selectedColor.ColorID,
        selectedSize.SizeID,
        quantity
      );

      await Swal.fire({
        title: "Thành công",
        text: "Đã thêm sản phẩm vào giỏ hàng",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Đã có lỗi xảy ra, vui lòng thử lại sau",
        icon: "error",
      });
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
          // console.log('Processed Variant:', variant); // Debug

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

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <section className="product-single container">
      <div className="row">
        {/* Hình ảnh sản phẩm */}
        <div className="col-lg-7">
          <div className="product-single__media vertical-thumbnail product-media-initialized">
            <div className="product-single__image position-relative">
              <div className="main-image">
                <img
                  src={product.MainImageURL}
                  alt={product.ProductName}
                  className="h-auto w-full"
                  width="674"
                  height="674"
                />
              </div>
              <div className="thumbnail-images flex gap-2 mt-2">
                {Array.from(new Set(product.image_paths.split(","))).map((image, index) => (
                  <div key={index} className="w-1/4">
                    <img src={image} alt={`Product image ${index + 1}`} className="h-auto w-full" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-lg-5">
          <h1 className="product-single__name text-2xl font-bold mb-4">
            {product.ProductName}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <strong className="text-xl font-semibold text-blue-600">
              {`₫${(product.SalePrice).toLocaleString()}`}
            </strong>
            <span className="line-through text-gray-500">
              {`₫${(product.Price).toLocaleString()}`}
            </span>
            <span className="bg-blue-100 text-blue-600 px-2 rounded">
              -{product.discount_percentage}%
            </span>
          </div>

          <div className="product-rating mt-2 mb-4">
            <span className="text-sm">
              Average Rating: {product.average_rating}
            </span>
            <span className="text-sm ml-4">
              Total Sold: {product.total_sold}
            </span>
          </div>

          <p className="product-views text-sm mb-2">Views: {product.Views}</p>
          <p className="product-single__short-desc mb-2">
            {product.ShortDescription}
          </p>
          <p className="description mb-4">{product.Description}</p>

          {/* Chọn kích thước và màu sắc */}
          <form onSubmit={handleAddToCart} className="space-y-6">
            {/* Product Sizes */}
            <div className="product-single__swatches space-y-4">
              <div className="product-swatch text-swatches">
                <label className="font-semibold text-gray-700">
                  Kích thước
                </label>
                <div className="swatch-list flex gap-2">
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
                        className={`swatch js-swatch cursor-pointer py-2 px-4 rounded-md transition-colors ${
                          selectedSize?.SizeID === size.SizeID
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                        htmlFor={`size-${size.SizeID}`}
                      >
                        {size.SizeName}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Product Colors */}
              <div className="product-swatch color-swatches">
                <label className="block text-sm font-medium text-gray-700 ">
                  Màu sắc
                </label>
                <div className="relative">
                  <div className="swatch-list flex gap-2 overflow-x-auto pb-1 hide-scrollbar max-w-[305px]">
                    {colors.map((color) => (
                      <div key={color.ColorID} className="flex-shrink-0">
                        <input
                          type="radio"
                          name="color"
                          id={`color-${color.ColorID}`}
                          className="hidden peer"
                          onChange={() => setSelectedColor(color)}
                        />
                        <label
                          className={`block w-7 h-7 rounded-full cursor-pointer transition-all duration-200 relative hover:scale-110 ${
                            selectedColor?.ColorID === color.ColorID
                              ? "ring-1 ring-blue-500 ring-offset-1"
                              : "ring-[0.5px] ring-gray-200"
                          }`}
                          htmlFor={`color-${color.ColorID}`}
                          title={color.ColorName}
                        >
                          <span
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: color.ColorName }}
                          />
                          {color.ColorName.toLowerCase() === "black" && (
                            <span className="absolute inset-[30%] rounded-full bg-white opacity-20" />
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-medium text-gray-700">
                Số lượng
              </label>
              <div className="relative flex items-center w-32 h-10 border rounded-lg bg-white">
                <button
                  type="button"
                  className="absolute left-0 w-8 h-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  <i className="fas fa-minus text-xs"></i>
                </button>

                <input
                  type="number"
                  name="quantity"
                  value={quantity}
                  min="1"
                  className="w-full h-full text-center text-gray-700 focus:outline-none
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onChange={(e) => {
                    const newValue =
                      e.target.value === "" ? "" : parseInt(e.target.value);
                    if (!isNaN(newValue)) {
                      if (variantInfo && newValue > variantInfo.Quantity) {
                        setIsExceedQuantity(true);
                        setQuantity(newValue);
                      } else {
                        setIsExceedQuantity(false);
                        setQuantity(newValue);
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    const validKeys = [
                      "Backspace",
                      "Delete",
                      "Tab",
                      "Escape",
                      "Enter",
                    ];
                    const isNumber = /[0-9]/.test(e.key);
                    const isValidKey = validKeys.includes(e.key);
                    const isModifier = e.ctrlKey || e.metaKey;

                    if (!isNumber && !isValidKey && !isModifier) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={() => {
                    if (quantity < 1) {
                      setQuantity(1);
                      setIsExceedQuantity(false);
                    }
                  }}
                />

                <button
                  type="button"
                  disabled={isExceedQuantity}
                  className={`absolute right-0 w-8 h-full flex items-center justify-center text-gray-500 transition-colors ${
                    isExceedQuantity
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-gray-700"
                  }`}
                  onClick={() => {
                    if (variantInfo && quantity >= variantInfo.Quantity) {
                      setIsExceedQuantity(true);
                      Swal.fire({
                        title: "Thông báo",
                        text: `Số lượng không được vượt quá ${variantInfo.Quantity}`,
                        icon: "warning",
                      });
                      return;
                    }
                    setQuantity(quantity + 1);
                  }}
                >
                  <i className="fas fa-plus text-xs"></i>
                </button>
              </div>
            </div>

            {/* Add to Cart and Wishlist Buttons */}
            <div className="flex items-center gap-4 mb-4">
              <button
                type="submit"
                disabled={
                  isChecking ||
                  (variantInfo && variantInfo.Quantity === 0) ||
                  isExceedQuantity
                }
                className={`flex-1 px-4 py-3 text-sm font-medium text-white rounded-lg transition-all duration-300 ${
                  isChecking ||
                  (variantInfo && variantInfo.Quantity === 0) ||
                  isExceedQuantity
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-dark active:transform active:scale-95"
                }`}
              >
                {isChecking
                  ? "Đang kiểm tra..."
                  : (variantInfo && variantInfo.Quantity === 0) ||
                    isExceedQuantity
                  ? "Hết hàng"
                  : typeof isAddedToCartProducts === "function" &&
                    isAddedToCartProducts(product.ProductID)
                  ? "Đã thêm vào giỏ"
                  : "Thêm vào giỏ"}
              </button>

              <button
                type="button"
                onClick={handleWishlistClick}
                disabled={wishlistLoading || isLoadingWishlist}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 border-red-500 transition-all duration-300 ${
                  inWishlist ? "bg-red-500" : "bg-white hover:scale-105"
                } ${
                  wishlistLoading || isLoadingWishlist
                    ? "opacity-50 cursor-not-allowed"
                    : "active:scale-95"
                }`}
              >
                <i
                  className={`fas text-xl ${
                    wishlistLoading || isLoadingWishlist
                      ? "fa-spinner fa-spin"
                      : "fa-heart"
                  } ${
                    inWishlist ? "text-white" : "text-red-500"
                  } transition-all duration-300`}
                ></i>
              </button>
            </div>

            {/* Stock Information */}
            {(isChecking || variantInfo) && (
              <div className="mt-4">
                {isChecking ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Đang kiểm tra...
                  </span>
                ) : (
                  variantInfo && (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isExceedQuantity
                          ? "bg-red-100 text-red-800"
                          : variantInfo.Quantity > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isExceedQuantity ? (
                        <>
                          <i className="fas fa-exclamation-circle mr-2"></i>
                          Vượt quá số lượng trong kho
                        </>
                      ) : variantInfo.Quantity > 0 ? (
                        <>
                          <i className="fas fa-check-circle mr-2"></i>
                          Có thể mua
                        </>
                      ) : (
                        <>
                          <i className="fas fa-times-circle mr-2"></i>
                          Hết hàng
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
              Description
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className="nav-link nav-link_underscore"
              id="tab-additional-info-tab"
              data-bs-toggle="tab"
              href="#tab-additional-info"
              role="tab"
              aria-controls="tab-additional-info"
              aria-selected="false"
            >
              Additional Information
            </a>
          </li>
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
              Reviews (2)
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
                    `Giá: $${product.Price}`,
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
