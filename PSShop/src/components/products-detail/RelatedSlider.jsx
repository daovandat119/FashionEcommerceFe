import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Star from "../../components/common/Star";
import { useContextElement } from "../../context/Context";
const swiperOptions = {
  modules: [Pagination, Navigation, Autoplay],
  autoplay: {
    delay: 5000,
  },
  spaceBetween: 30,
  slidesPerView: 4,
  slidesPerGroup: 1,
  effect: "none",
  loop: true,
  pagination: {
    el: ".products-pagination",
    type: "bullets",
    clickable: true,
  },
  navigation: {
    nextEl: ".products-carousel__next",
    prevEl: ".products-carousel__prev",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 15,
    },
    576: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 25,
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },
};

export default function RelatedSlider() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useContextElement();

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId); // Đảm bảo gọi hàm xóa
      setWishlistStatus((prev) => ({ ...prev, [productId]: false })); // Cập nhật trạng thái khi xóa
    } else {
      await addToWishlist(productId); // Đảm bảo gọi hàm thêm
      setWishlistStatus((prev) => ({ ...prev, [productId]: true })); // Cập nhật trạng thái khi thêm
    }
  };
  useEffect(() => {
    // Gọi API PHP từ React
    axios
      .post("http://127.0.0.1:8000/api/products/index", {
        
      })
      .then((response) => {
        setProducts(response.data.data || response.data); // Điều chỉnh nếu cần
        setLoading(false);
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi gọi API", error);
        setError("Không thể tải sản phẩm.");
        setLoading(false);
      });
  }, []);

  return (
    <section className="products-carousel container position-relative">
      <h2 className="h3 text-uppercase mb-4 pb-xl-2 mb-xl-4">
        Related <strong>Products</strong>
      </h2>
      <div className="position-relative">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Swiper {...swiperOptions}>
            {products.map((product, i) => (
              <SwiperSlide key={i} className="swiper-slide product-card">
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
                  </Link>
                  <Link to={`/shop-detail/${product.ProductID}`}>
                        <button className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside">
                          Xem chi tiết
                        </button>
                      </Link>
                  {product.discount_percentage > 0 && (
                    <span className="discount-label position-absolute top-0 start-0 m-1 border border-light bg-red text-white p-1 rounded">
                      -{product.discount_percentage}%
                    </span>
                  )}
                </div>
                {/* Thông tin sản phẩm */}
                <div className="p-2 text-left">
                  <div className="flex justify-between items-center">
                    <p className="mb-0 text-sm">{product.category_name}</p>
                    <div className="flex items-center">
                      <Star stars={product.average_rating} />
                      <span className="text-gray-500 ml-1">
                        {product.reviews}
                      </span>
                    </div>
                  </div>
                  <h6 className="text-lg font-semibold">
                    <Link to={`/shop-detail/${product.ProductID}`}>
                      {product.ProductName}
                    </Link>
                  </h6>
                  <div className="flex justify-between items-center">
                  <div className="flex justify-start">
                    <span className="text-lg font-bold text-red-600">
                      {Math.floor(product.SalePrice)}VND
                    </span>
                    {product.Price && (
                      <span className="text-sm mt-1 line-through text-gray-500 ml-2">
                        {Math.floor(product.Price)}VND
                      </span>
                    )}
                  </div>
                  <button
                    title="Add To Wishlist"
                    className={`transition-transform duration-200 hover:scale-110 active:scale-95 ${
                      isInWishlist(product.ProductID) ||
                      wishlistStatus[product.ProductID]
                        ? "active"
                        : ""
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
                      fill={
                        isInWishlist(product.ProductID) ||
                        wishlistStatus[product.ProductID]
                          ? "red"
                          : "none"
                      } // Thay đổi màu sắc
                    >
                      <path d="M9.06,25C7.68,17.3,12.78,10.63,20.73,10c7-.55,10.47,7.93,11.17,9.55a.13.13,0,0,0,.25,0c3.25-8.91,9.17-9.29,11.25-9.5C49,9.45,56.51,13.78,55,23.87c-2.16,14-23.12,29.81-23.12,29.81S11.79,40.05,9.06,25Z" />
                    </svg>
                  </button>
                  </div>
                  <p className="text-sm text-gray-600">
                      Đã bán: {product.total_sold}
                    </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div
          className="products-carousel__prev cursor-pointer position-absolute top-50 start-0 translate-middle-y z-1 bg-white rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: "50px", height: "50px", left: "-25px" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>

        <div
          className="products-carousel__next cursor-pointer position-absolute top-50 end-0 translate-middle-y z-1 bg-white rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: "50px", height: "50px", right: "-25px" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>

        <div className="products-pagination mt-4 d-flex align-items-center justify-content-center"></div>
      </div>
    </section>
  );
}
