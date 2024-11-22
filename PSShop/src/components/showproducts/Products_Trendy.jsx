import Star from "../../components/common/Star";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useContextElement } from "../../context/Context";

const filterCategories = [
  "Tất cả",
  "Hàng mới đến",
  "Bán chạy nhất",
  "Được xếp hạng hàng đầu",
];

export default function Products_Trendy() {
  const [currentCategory, setCurrentCategory] = useState(filterCategories[0]);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [wishlistStatus, setWishlistStatus] = useState({});
  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useContextElement();
  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    axios
      .post("http://127.0.0.1:8000/api/products/index", {
        
      })
      .then((response) => {
        const fetchedProducts = response.data.data || response.data;
        setProducts(fetchedProducts);
        setFiltered(fetchedProducts); // Mặc định hiển thị tất cả sản phẩm
        setLoading(false);
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi gọi API", error);
        setError("Không thể tải sản phẩm.");
        setLoading(false);
      });
  }, []);

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId); // Đảm bảo gọi hàm xóa
      setWishlistStatus((prev) => ({ ...prev, [productId]: false })); // Cập nhật trạng thái khi xóa
    } else {
      await addToWishlist(productId); // Đảm bảo gọi hàm thêm
      setWishlistStatus((prev) => ({ ...prev, [productId]: true })); // Cập nhật trạng thái khi thêm
    }
  };
  // Lọc sản phẩm theo danh mục
  useEffect(() => {
    let updatedFiltered = [];
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // Lấy thời điểm 2 tuần trước

    if (currentCategory === "Tất cả") {
      updatedFiltered = products;
    } else if (currentCategory === "Hàng mới đến") {
      updatedFiltered = products.filter((product) => {
        const createdAt = new Date(product.created_at);
        return createdAt >= twoWeeksAgo; // Lọc sản phẩm mới đến
      });
    } else if (currentCategory === "Bán chạy nhất") {
      updatedFiltered = products.filter((product) => product.Views > 50);
    } else if (currentCategory === "Được xếp hạng hàng đầu") {
      updatedFiltered = products.filter(
        (product) => parseFloat(product.average_rating) >= 4
      );
    }
    setFiltered(updatedFiltered);
  }, [currentCategory, products]);

  return (
    <section className="products-grid container">
      <h2 className="section-title text-uppercase text-center mb-1 mb-md-3 pb-xl-2 mb-xl-4">
        Sản phẩm <strong>Thịnh hành</strong>
      </h2>

      {/* Tabs phân loại */}
      <ul className="nav nav-tabs mb-3 text-uppercase justify-content-center">
        {filterCategories.map((category, i) => (
          <li
            onClick={() => setCurrentCategory(category)}
            key={i}
            className="nav-item"
            role="presentation"
          >
            <button
              className={`nav-link nav-link_underscore ${
                currentCategory === category ? "active" : ""
              }`}
              type="button"
            >
              {category}
            </button>
          </li>
        ))}
      </ul>

      {/* Hiển thị sản phẩm */}
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filtered.length === 0 ? (
        <p>Không có sản phẩm nào.</p>
      ) : (
        <div className="tab-content pt-2" id="collections-tab-content">
          <div
            className="tab-pane fade show active"
            role="tabpanel"
            aria-labelledby="collections-tab-1-trigger"
          >
            <div className="row">
              {filtered.map((product) => (
                <div
                  key={product.ProductID}
                  className="col-6 col-md-4 col-lg-3"
                >
                  {/* Card sản phẩm */}
                  <div className="mb-4 bg-white">
                    <div className="relative m-1">
                      {product.discount_percentage > 0 && ( // Hiển thị mã giảm giá nếu có
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
                          className="w-[330px] h-[400px] "
                        />
                        <button
                    className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                  >
                    Xem chi tiết
                  </button>
                      </Link>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="p-2 text-left">
                      <div className="flex justify-between items-center">
                        <p className="mb-0 text-sm">{product.category_name}</p>
                        <div className=" items-center">
                          {" "}
                          {/* Thay đổi từ flex-col sang flex */}
                          <div className="flex items-center">
                            {" "}
                            {/* Thêm class items-center để căn giữa */}
                            <Star stars={product.average_rating} />
                            <span className="flex text-gray-500 ml-3">
                              {product.reviews}
                            </span>
                          </div>
                        </div>
                      </div>

                      <h6 className="text-lg font-semibold">
                        <Link to={`/shop-detail/${product.ProductID}`}>
                          {product.ProductName}
                        </Link>
                      </h6>
                      <div className="flex justify-between ">
                        <div className="flex justify-start">
                          <span className="text-lg  font-bold text-red-600">
                            {product.SalePrice}₫
                          </span>
                          {product.Price && (
                            <span className="text-sm mt-1 line-through text-gray-500 ml-2">
                              {product.Price}₫
                            </span>
                          )}
                        </div>
                        <div className="mr-4">
                        <button
              title="Add To Wishlist"
              className={`transition-transform duration-200 hover:scale-110 active:scale-95 ${
                isInWishlist(product.ProductID) || wishlistStatus[product.ProductID] ? "active" : ""
              }`}
              onClick={() => toggleWishlist(product.ProductID)} // Gọi hàm toggleWishlist
            >
              <svg
                width="25px"
                height="25px"
                className=""
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000000"
                fill={isInWishlist(product.ProductID) || wishlistStatus[product.ProductID] ? "red" : "none"} // Thay đổi màu sắc
              >
                <path d="M9.06,25C7.68,17.3,12.78,10.63,20.73,10c7-.55,10.47,7.93,11.17,9.55a.13.13,0,0,0,.25,0c3.25-8.91,9.17-9.29,11.25-9.5C49,9.45,56.51,13.78,55,23.87c-2.16,14-23.12,29.81-23.12,29.81S11.79,40.05,9.06,25Z" />
              </svg>
            </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                      Đã bán: {product.total_sold}
                    </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Nút khám phá thêm */}
            <div className="text-center mt-2">
              <Link
                className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
                to="/shop"
              >
                Khám phá thêm
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
