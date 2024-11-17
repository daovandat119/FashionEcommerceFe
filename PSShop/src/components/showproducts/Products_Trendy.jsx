import Star from "../../components/common/Star";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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
  const [wishlist, setWishlist] = useState([]);

  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products")
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

  // Xử lý thêm hoặc xoá sản phẩm vào danh sách yêu thích
  const toggleWishlist = (ProductID) => {
    if (wishlist.includes(ProductID)) {
      setWishlist(wishlist.filter((id) => id !== ProductID));
    } else {
      setWishlist([...wishlist, ProductID]);
    }
  };

  // Kiểm tra sản phẩm có trong wishlist không
  const isAddedtoWishlist = (ProductID) => {
    return wishlist.includes(ProductID);
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
                  <div className="product-card mb-3 mb-md-4 mb-xxl-5 border border-light rounded-lg shadow-sm">
                    <div className="pc__img-wrapper position-relative m-1">
                      <Link to={`/shop-detail/${product.ProductID}`}>
                        <img
                          loading="lazy"
                          src={product.MainImageURL}
                          width="330"
                          height="300" // Rút ngắn chiều cao
                          alt={product.ProductName}
                          className="pc__img rounded-top"
                        />
                        <img
                          loading="lazy"
                          src={
                            product.SecondImageURL || product.MainImageURL
                          }
                          width="330"
                          height="300" // Rút ngắn chiều cao
                          className="pc__img pc__img-second rounded-top"
                          alt={`${product.ProductName} secondary`}
                        />
                      </Link>
                      {product.discount_percentage > 0 && (
                        <span className="discount-label position-absolute top-0 start-0 m-1 border border-light bg-dark text-white p-1 rounded">
                          -{product.discount_percentage}%
                        </span>
                      )}
                      <Link to={`/shop-detail/${product.ProductID}`}>
                        <button className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium">
                          XEM
                        </button>
                      </Link>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="pc__info position-relative text-start m-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="pc__category mb-0">
                          {product.category_name}
                        </p>
                        <div className="d-flex align-items-center">
                          <Star stars={product.average_rating} />
                          <span className="reviews-note text-lowercase text-secondary ms-1">
                            {product.reviews}
                          </span>
                        </div>
                      </div>
                      <h6 className="pc__title">
                        <Link to={`/shop-detail/${product.ProductID}`}>
                          {product.ProductName}
                        </Link>
                      </h6>
                      <div className="product-card__price d-flex justify-content-start">
                        <span className="money price">
                          ${product.Price}
                        </span>
                      </div>
                    </div>

                    {/* Nút yêu thích */}
                    <button
                      className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${
                        isAddedtoWishlist(product.ProductID) ? "active" : ""
                      }`}
                      title="Thêm vào danh sách yêu thích"
                      onClick={() => toggleWishlist(product.ProductID)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_heart" />
                      </svg>
                    </button>
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