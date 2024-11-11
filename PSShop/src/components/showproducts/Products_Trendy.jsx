import Star from "../../components/common/Star";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const filterCategories = ["All", "New Arrivals", "Best Seller", "Top Rated"];

export default function Products_Trendy() {
  const [currentCategory, setCurrentCategory] = useState(filterCategories[0]);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Gọi API để lấy sản phẩm
    axios
      .get("http://127.0.0.1:8000/api/products")
      .then((response) => {
        // console.log("Response data:", response.data);
        const fetchedProducts = response.data.data || response.data;
        // console.log("Fetched Products:", fetchedProducts); // Kiểm tra dữ liệu nhận được
        setProducts(fetchedProducts);
        setFiltered(getRandomProducts(fetchedProducts, 4)); // Khởi tạo với 4 sản phẩm ngẫu nhiên
        setLoading(false);
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi gọi API", error);
        setError("Không thể tải sản phẩm.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (currentCategory === "All") {
      setFiltered(products.slice(0, 8)); // Hiển thị 8 sản phẩm đầu tiên khi chọn "All"
      // console.log("Filtered (All):", products.slice(0, 8));
    } else {
      setFiltered(getRandomProducts(products, 4)); // Hiển thị 4 sản phẩm ngẫu nhiên cho các danh mục khác
      console.log(`Filtered (${currentCategory}):`, getRandomProducts(products, 4));
    }
  }, [currentCategory, products]);

  // Hàm lấy n sản phẩm ngẫu nhiên từ danh sách sản phẩm
  const getRandomProducts = (products, count) => {
    if (products.length <= count) return products;
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Hàm thêm sản phẩm vào giỏ hàng

  // Hàm thêm hoặc loại bỏ sản phẩm khỏi danh sách yêu thích
  const toggleWishlist = (ProductID) => {
    if (wishlist.includes(ProductID)) {
      setWishlist(wishlist.filter((id) => id !== ProductID));
      console.log(`Removed ProductID ${ProductID} from wishlist`);
    } else {
      setWishlist([...wishlist, ProductID]);
      console.log(`Added ProductID ${ProductID} to wishlist`);
    }
  };

  // Hàm kiểm tra sản phẩm đã có trong danh sách yêu thích hay chưa
  const isAddedtoWishlist = (ProductID) => {
    return wishlist.includes(ProductID);
  };

  return (
    <section className="products-grid container">
      <h2 className="section-title text-uppercase text-center mb-1 mb-md-3 pb-xl-2 mb-xl-4">
        Our Trendy <strong>Products</strong>
      </h2>

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

      {loading ? (
        <p>Loading...</p>
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
                <div key={product.ProductID} className="col-6 col-md-4 col-lg-3">
                  <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                    <div className="pc__img-wrapper">
                      <Link to={`/shop-detail/${product.ProductID}`}>
                        <img
                          loading="lazy"
                          src={product.MainImageURL}
                          width="330"
                          height="400"
                          alt={product.ProductName}
                          className="pc__img"
                        />
                        <img
                          loading="lazy"
                          src={product.SecondImageURL || product.MainImageURL} // Nếu có ảnh thứ hai, nếu không dùng ảnh chính
                          width="330"
                          height="400"
                          className="pc__img pc__img-second"
                          alt={`${product.ProductName} secondary`}
                        />
                      </Link>
                      <Link to={`/shop-detail/${product.ProductID}`}>
                      <button
                        className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                        
                      >
                        VIEW 
                      </button>
                      </Link>
                    </div>

                    <div className="pc__info position-relative">
                      <p className="pc__category">{product.category_name}</p>
                      <h6 className="pc__title">
                        <Link to={`/shop-detail/${product.ProductID}`}>
                          {product.ProductName}
                        </Link>
                      </h6>
                      <div className="product-card__price d-flex">
                        <span className="money price">${product.Price}</span>
                      </div>
                      <div className="product-card__review d-flex align-items-center">
                        <div className="reviews-group d-flex">
                          <Star stars={product.rating} />
                        </div>
                        <span className="reviews-note text-lowercase text-secondary ms-1">
                          {product.reviews}
                        </span>
                      </div>

                      <button
                        className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${
                          isAddedtoWishlist(product.ProductID) ? "active" : ""
                        }`}
                        title="Add To Wishlist"
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
                </div>
              ))}
            </div>
            {/* <!-- /.row --> */}
            <div className="text-center mt-2">
              <Link
                className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
                to="/shop"
              >
                Discover More
              </Link>
            </div>
          </div>
          {/* <!-- /.tab-pane fade show--> */}
        </div>
      )}
      {/* <!-- /.tab-content pt-2 --> */}
    </section>
  );
}
