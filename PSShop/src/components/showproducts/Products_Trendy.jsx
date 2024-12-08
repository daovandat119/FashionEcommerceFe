import Star from "../../components/common/Star";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useContextElement } from "../../context/Context";

// Danh sách các bộ lọc
const filterCategories = [
  { label: "Tất cả", sortBy: null },
  { label: "Hàng mới đến", sortBy: "created_at" },
  { label: "Sản phẩm được quan tâm", sortBy: "view" },
  { label: "Được xếp hạng hàng đầu", sortBy: "average_rating" },
];

export default function Products_Trendy() {
  const [currentCategory, setCurrentCategory] = useState(
    filterCategories[0].label
  );
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useContextElement();
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const sortBy =
          filterCategories.find((cat) => cat.label === currentCategory)
            ?.sortBy || null;
        const response = await axios.post(
          "http://127.0.0.1:8000/api/products/index",
          {
            Search: "",
            CategoryID: null,
            ColorID: null,
            SizeID: null,
            SortBy: sortBy,
            Page: 1,
            Limit: 8,
          }
        );

        const fetchedProducts = response.data.data || response.data;
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi API:", error);
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory]);

  // Xử lý thêm/xóa khỏi wishlist
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
      setWishlistStatus((prev) => ({ ...prev, [productId]: false }));
    } else {
      await addToWishlist(productId);
      setWishlistStatus((prev) => ({ ...prev, [productId]: true }));
    }
  };

  return (
    <section className="products-grid container">
      <h2 className="section-title text-uppercase text-center mb-1 mb-md-3 pb-xl-2 mb-xl-4">
        Sản phẩm <strong>Thịnh hành</strong>
      </h2>

      {/* Tabs phân loại */}
      <ul className="nav nav-tabs mb-3 text-uppercase justify-content-center">
        {filterCategories.map((category, i) => (
          <li
            key={i}
            className="nav-item"
            role="presentation"
            onClick={() => setCurrentCategory(category.label)}
          >
            <button
              className={`nav-link nav-link_underscore ${
                currentCategory === category.label ? "active" : ""
              }`}
              type="button"
            >
              {category.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Hiển thị sản phẩm */}
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : products.length === 0 ? (
        <p>Không có sản phẩm nào.</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div
              key={product.ProductID}
              className="col-6 col-md-4 col-lg-3 mb-5"
            >
              <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                {product.discount_percentage > 0 && (
                  <span className="absolute top-3 left-0 h-[30px] w-[53px] bg-red-600 text-white p-1 rounded">
                    -{product.discount_percentage}%
                  </span>
                )}
                {new Date(product.created_at) >
                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) &&
                  product.ProductID && ( // Kiểm tra xem sản phẩm có được tạo trong 7 ngày qua không và có mã
                    <div className="absolute top-12 left-0  product-label bg-white text-dark">
                      NEW
                    </div>
                  )}
                <Link to={`/shop-detail/${product.ProductID}`}>
                  <img
                    loading="lazy"
                    src={product.MainImageURL}
                    width="330"
                    height="400"
                    alt={product.ProductName}
                    className="w-[400px] h-[450px]"
                  />
                </Link>
                <Link to={`/shop-detail/${product.ProductID}`}>
                  <button className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium">
                    Xem chi tiết
                  </button>
                </Link>
              </div>

              {/* Thông tin sản phẩm */}
              <div className="p-2 text-left">
                <div className="flex justify-between items-center">
                  <p className="mb-0 text-sm">{product.category_name}</p>
                  <div className="flex items-center">
                    <Star stars={product.average_rating} />
                    {/* <span className="text-gray-500 ml-1">{product.total_sold}</span> */}
                  </div>
                </div>
                <h6 className="text-lg font-semibold">
                  <Link to={`/shop-detail/${product.ProductID}`}>
                    {product.ProductName}
                  </Link>
                </h6>
                <div className="flex justify-between">
                  <div>
                    <span className="text-lg font-bold text-red-600">
                      {Math.floor(product.SalePrice)} VND
                    </span>
                    {product.Price && (
                      <span className="text-sm line-through text-gray-500 ml-2">
                        {Math.floor(product.Price)} VND
                      </span>
                    )}
                  </div>
                  <button
                    title="Add To Wishlist"
                    onClick={() => toggleWishlist(product.ProductID)}
                    className={`transition-transform duration-200 hover:scale-110 ${
                      isInWishlist(product.ProductID) ||
                      wishlistStatus[product.ProductID]
                        ? "active"
                        : ""
                    }`}
                  >
                    <svg
                      width="25px"
                      height="25px"
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#000000"
                      fill={
                        isInWishlist(product.ProductID) ||
                        wishlistStatus[product.ProductID]
                          ? "red"
                          : "none"
                      }
                    >
                      <path d="M9.06,25C7.68,17.3,12.78,10.63,20.73,10c7-.55,10.47,7.93,11.17,9.55a.13.13,0,0,0,.25,0c3.25-8.91,9.17-9.29,11.25-9.5C49,9.45,56.51,13.78,55,23.87c-2.16,14-23.12,29.81-23.12,29.81S11.79,40.05,9.06,25Z" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Đã bán: {product.total_sold}
                </p>
              </div>
            </div>
          ))}
          <div className="text-center mt-2 mb-3">
            <Link
              className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
              to="/shop"
            >
              Discover More
            </Link>
          </div>
        </div>
        
      )}
    </section>
  );
}
