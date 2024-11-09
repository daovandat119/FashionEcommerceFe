import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useContextElement } from "../../context/Context";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";
import Swal from "sweetalert2";
import Description from "./Description";

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

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch product data
        const [productRes, sizesRes, colorsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/products/${id}`, config),
          axios.get("http://127.0.0.1:8000/api/sizes", config),
          axios.get("http://127.0.0.1:8000/api/colors", config),
        ]);

        setProduct(productRes.data.data);
        setSizes(sizesRes.data.data);
        setColors(colorsRes.data.data);

        // Fetch wishlist
        await fetchWishlistItems();
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, [id, fetchWishlistItems]);

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
    if (!selectedSize || !selectedColor) return null;

    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/product-variants/getVariantByID`,
        {
          ProductID: product.ProductID,
          SizeID: selectedSize.SizeID,
          ColorID: selectedColor.ColorID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("Lỗi xác thực token");
        // Có thể xử lý logout hoặc refresh token tại đây
      }
      console.error("Lỗi khi kiểm tra biến thể:", error);
      return null;
    }
  }, [selectedSize, selectedColor, product]);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Thêm dòng này

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

      if (variant.Quantity < quantity) {
        Swal.fire({
          title: "Số lượng không đủ",
          text: `Chỉ còn ${variant.Quantity} sản phẩm trong kho`,
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

  // Thêm useEffect để kiểm tra biến thể khi chọn size và color
  // Xóa useEffect cũ và giữ lại useEffect này
  useEffect(() => {
    const checkVariant = async () => {
      if (selectedSize && selectedColor && product) {
        const variant = await checkProductVariant();
        setVariantInfo(variant);
        // Cập nhật giá nếu biến thể tồn tại và có giá
        if (variant && variant.Price) {
          setVariantPrice(variant.Price);
        } else {
          // Nếu không có biến thể hoặc không có giá, dùng giá gốc
          setVariantPrice(product.Price);
        }
      } else {
        // Reset về giá gốc khi không có size hoặc color được chọn
        setVariantPrice(null);
      }
    };
    checkVariant();
  }, [selectedSize, selectedColor, product]);

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
              <img
                src={product.MainImageURL}
                alt={product.ProductName}
                className="h-auto w-100"
                width="674"
                height="674"
              />
            </div>
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-lg-5">
          <h1 className="product-single__name">{product.ProductName}</h1>
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-blue-600">
              ${(variantPrice || product?.Price || 0).toLocaleString()}
            </span>
            {variantPrice && variantPrice !== product?.Price && (
              <span className="text-sm text-gray-500 line-through">
                ${product?.Price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="product-single__short-desc">
            <p>{product.Description}</p>
          </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc
                </label>
                <div className="relative">
                  <div className="swatch-list flex gap-2 overflow-x-auto pb-1 hide-scrollbar max-w-[195px]">
                    {colors.map((color) => (
                      <div key={color.ColorID} className="flex-shrink-0 ml-1">
                        <input
                          type="radio"
                          name="color"
                          id={`color-${color.ColorID}`}
                          className="hidden peer"
                          onChange={() => setSelectedColor(color)}
                        />
                        <label
                          className={`
              block w-7 h-7 rounded-full cursor-pointer
              transition-all duration-200 relative
              hover:scale-110
              ${
                selectedColor?.ColorID === color.ColorID
                  ? "ring-1 ring-blue-500 ring-offset-1"
                  : "ring-[0.5px] ring-gray-200"
              }
            `}
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
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Số lượng
              </label>
              <div className="relative flex items-center w-32 h-10 border rounded-lg bg-white">
                <button
                  type="button"
                  className="absolute left-0 w-8 h-full flex items-center justify-center
        text-gray-500 hover:text-gray-700 transition-colors"
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
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />

                <button
                  type="button"
                  className="absolute right-0 w-8 h-full flex items-center justify-center
        text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <i className="fas fa-plus text-xs"></i>
                </button>
              </div>
            </div>

            {/* Add to Cart and Wishlist Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={
                  isChecking || (variantInfo && variantInfo.Quantity === 0)
                }
                className={`flex-1 px-4 py-3 text-sm font-medium text-white rounded-lg transition-all duration-300 ${
                  isChecking || (variantInfo && variantInfo.Quantity === 0)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-dark active:transform active:scale-95"
                }`}
              >
                {isChecking
                  ? "Đang kiểm tra..."
                  : variantInfo && variantInfo.Quantity === 0
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
            {variantInfo && (
              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    variantInfo.Quantity > 0
                      ? "bg-green-100 text-green-800 border border-green-800"
                      : "bg-red-100 text-red-800 border border-red-800"
                  }`}
                >
                  {variantInfo.Quantity > 0 ? (
                    <>
                      <i className="fas fa-check-circle mr-2"></i>
                      Còn <strong>{variantInfo.Quantity}</strong> sản phẩm trong
                      kho
                    </>
                  ) : (
                    <>
                      <i className="fas fa-times-circle mr-2"></i>
                      Hết hàng
                    </>
                  )}
                </span>
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
                    `Thương hiệu: ${product.Brand || "Chưa cập nhật"}`,
                    `Danh mục: ${product.Category || "Chưa cập nhật"}`,
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
      {/* Thông tin bổ sung và đánh giá */}
    </section>
  );
};

export default ProductDetail;
