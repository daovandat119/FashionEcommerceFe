import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useContextElement } from "../../context/Context";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";
import Swal from "sweetalert2";

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

  const {
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    wishlistProducts,
    fetchWishlistItems,
  } = useContextElement();

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Redirecting to login...");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Lấy dữ liệu sản phẩm từ API
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}`, config)
      .then((response) => {
        setProduct(response.data.data); // Chỉ lấy phần dữ liệu từ API
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });

    // Lấy dữ liệu kích thước từ API
    axios
      .get("http://127.0.0.1:8000/api/sizes", config)
      .then((response) => {
        setSizes(response.data.data); // Lưu kích thước từ API
      })
      .catch((error) => {
        console.error("Error fetching sizes:", error);
      });

    // Lấy dữ liệu màu sắc từ API
    axios
      .get("http://127.0.0.1:8000/api/colors", config)
      .then((response) => {
        setColors(response.data.data); // Lưu màu sắc từ API
      })
      .catch((error) => {
        console.error("Error fetching colors:", error);
      });
  }, [id]);

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
    if (wishlistProducts && product) {
      const exists = wishlistProducts.some(
        (item) => parseInt(item.ProductID) === parseInt(product.ProductID)
      );
      setIsInWishlist(exists);
    }
  }, [wishlistProducts, product]);

  const handleAddToWishlist = async () => {
    if (!product) return;

    try {
      await addToWishlist(product.ProductID);
    } catch (error) {
      console.error("Lỗi khi thêm vào wishlist:", error);
    }
  };

  const checkProductVariant = async () => {
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
  };
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
  useEffect(() => {
    const checkVariant = async () => {
      if (selectedSize && selectedColor && product) {
        const variant = await checkProductVariant();
        setVariantInfo(variant);
      }
    };
    checkVariant();
  }, [selectedSize, selectedColor]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return <div>Loading...</div>;
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
          <div className="product-single__price">
            <span className="current-price">${product.Price}</span>
          </div>

          <div className="product-single__short-desc">
            <p>{product.Description}</p>
          </div>

          {/* Chọn kích thước và màu sắc */}
          <form onSubmit={handleAddToCart}>
            <div className="product-single__swatches">
              {/* Hiển thị kích thước */}
              <div className="product-swatch text-swatches">
                <label>Kích thước</label>
                <div className="swatch-list">
                  {sizes.map((size) => (
                    <React.Fragment key={size.SizeID}>
                      <input
                        type="radio"
                        name="size"
                        id={`size-${size.SizeID}`}
                        onChange={() => setSelectedSize(size)}
                      />
                      <label
                        className={`swatch js-swatch ${
                          selectedSize?.SizeID === size.SizeID ? "active" : ""
                        }`}
                        htmlFor={`size-${size.SizeID}`}
                        aria-label={size.SizeName}
                      >
                        {size.SizeName}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Hiển thị màu sắc */}
              <div className="product-swatch color-swatches">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <div key={color.ColorID} className="relative">
                      <input
                        type="radio"
                        name="color"
                        id={`color-${color.ColorID}`}
                        className="sr-only"
                        onChange={() => setSelectedColor(color)}
                      />
                      <label
                        htmlFor={`color-${color.ColorID}`}
                        className={`
            group flex items-center justify-center w-8 h-8 rounded-full 
            cursor-pointer border transition-all duration-200
            ${
              selectedColor?.ColorID === color.ColorID
                ? "border-blue-500 ring-1 ring-blue-500 ring-offset-1"
                : "border-gray-300 hover:border-gray-400"
            }
          `}
                      >
                        <span
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color.ColorName }}
                        ></span>
                        <span className="sr-only">{color.ColorName}</span>

                        {/* Tooltip nhỏ hơn */}
                        <span
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 
            px-1.5 py-0.5 text-xs font-medium text-white bg-gray-900 rounded opacity-0 
            group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                        >
                          {color.ColorName}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Số lượng sản phẩm */}
            <div className="product-single__addtocart">
              {/* Số lượng và controls */}
              <div className="flex items-center gap-4 mb-4">
                {/* Số lượng sản phẩm */}
                <div className="relative flex items-center border rounded-lg w-32">
                  <input
                    type="number"
                    name="quantity"
                    value={quantity}
                    min="1"
                    className="w-full px-3 py-2 text-center focus:outline-none"
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <button
                      type="button"
                      className="px-2 py-1 text-gray-600 hover:text-gray-800"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      -
                    </button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      type="button"
                      className="px-2 py-1 text-gray-600 hover:text-gray-800"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Buttons Container */}
              <div className="flex gap-3 mb-4">
                {/* Add to Cart Button */}
                <button
                  type="submit"
                  disabled={
                    isChecking || (variantInfo && variantInfo.Quantity === 0)
                  }
                  className={`flex-1 px-6 py-3 text-sm font-medium text-white rounded-lg transition-all duration-300 
                    ${
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

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={handleAddToWishlist}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-300
                    ${
                      isInWishlist
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-white border-2 border-red-500 text-red-500 hover:bg-red-50"
                    }
                    focus:outline-none active:transform active:scale-95`}
                >
                  <i
                    className={`fas fa-heart ${
                      isInWishlist
                        ? "animate-heartBeat"
                        : "hover:scale-110 transition-transform duration-300"
                    }`}
                  ></i>
                </button>
              </div>

              {/* Stock Info */}
              {variantInfo && (
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${
                      variantInfo.Quantity > 0
                        ? "bg-green-100 text-green-800 border border-green-800"
                        : "bg-red-100 text-red-800 border border-red-800"
                    }`}
                  >
                    {variantInfo.Quantity > 0 ? (
                      <>
                        <i className="fas fa-check-circle mr-2"></i>
                        <span>
                          Còn <strong>{variantInfo.Quantity}</strong> sản phẩm
                          trong kho
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-times-circle mr-2"></i>
                        <span className="font-semibold">Hết hàng</span>
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>
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
            {/* <Description /> */}
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
