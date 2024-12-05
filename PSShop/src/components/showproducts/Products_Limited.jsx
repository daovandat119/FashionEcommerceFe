import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Star from "../../components/common/Star"; // Import component Star
import { useContextElement } from "../../context/Context";

const swiperOptions = {
  modules: [Pagination, Navigation, Autoplay],
  autoplay: {
    delay: 5000,
  },
  slidesPerView: 4,
  slidesPerGroup: 4,
  effect: "none",
  loop: true,
  pagination: {
    el: "#product_carousel .products-pagination",
    type: "bullets",
    clickable: true,
  },
  navigation: {
    nextEl: "#product_carousel .products-carousel__next",
    prevEl: "#product_carousel .products-carousel__prev",
  },
  breakpoints: {
    320: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 14,
    },
    768: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 24,
    },
    992: {
      slidesPerView: 4,
      slidesPerGroup: 2,
      spaceBetween: 30,
    },
  },
};

export default function Products_Limited() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState({}); // Di chuyển vào trong hàm
  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useContextElement(); // Di chuyển vào trong hàm

  useEffect(() => {
    axios
      .post("http://127.0.0.1:8000/api/products/index", {})
      .then((response) => {
        setProducts(response.data.data);
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
  return (
    <section className="container mx-auto">
      <h2 className="section-title text-uppercase text-center mb-1 mb-md-3 pb-xl-2 mb-xl-4">
        Phiên Bản <strong>Giới Hạn</strong>
      </h2>

      <div id="product_carousel" className="relative">
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Swiper
            style={{ maxWidth: "100vw", overflow: "hidden" }}
            {...swiperOptions}
            className="swiper-container"
          >
            {products.map((product, i) => (
              <SwiperSlide key={i} className="swiper-slide product-card">
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
                        className="w-[400px] h-[450px] "
                      />
                    </Link>
                    <Link to={`/shop-detail/${product.ProductID}`}>
                      <button className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside">
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
                    <div className="flex justify-between ">
                      <div className="flex justify-start">
                        <span className="text-lg font-bold text-red-600">
                          {Math.floor(product.SalePrice)}VND
                        </span>
                        {product.Price && (
                          <span className="text-sm line-through text-gray-500 ml-2">
                            {Math.floor(product.Price)}VND
                          </span>
                        )}
                      </div>

                      <div className="mr-4">
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
                    </div>
                    <p className="text-sm text-gray-600">
                      Đã bán: {product.total_sold}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <div className="cursor-pointer products-carousel__prev absolute top-1/2 transform -translate-y-1/2 flex items-center justify-center">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use href="#icon_prev_md" />
          </svg>
        </div>
        <div className="cursor-pointer products-carousel__next absolute top-1/2 transform -translate-y-1/2 flex items-center justify-center">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use href="#icon_next_md" />
          </svg>
        </div>
        <div className="products-pagination mt-4 mb-5 flex items-center justify-center"></div>
      </div>
    </section>
  );
}
