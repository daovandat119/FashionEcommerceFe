import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Star from "../../components/common/Star"; // Import component Star

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

  useEffect(() => {
    axios.post('http://127.0.0.1:8000/api/products/index', {
     
    })
      .then(response => {
        setProducts(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Có lỗi xảy ra khi gọi API", error);
        setError("Không thể tải sản phẩm.");
        setLoading(false);
      });
  }, []);

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
              <SwiperSlide key={i} className="swiper-slide">
                <div className="mb-4 border border-light rounded-lg shadow-sm bg-white">
                  <div className="relative m-1">
                    {product.discount_percentage > 0 && (
                      <span className="absolute top-0 left-0 m-1 border border-light bg-red-600 text-white p-1 rounded">
                        -{product.discount_percentage}%
                      </span>
                    )}
                    <Link to={`/shop-detail/${product.ProductID}`}>
                      <img
                        loading="lazy"
                        src={product.MainImageURL}
                        width="330"
                        height="400"
                        alt={product.ProductName}
                        className="w-full h-auto rounded-t-lg"
                      />
                    </Link>
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="p-2 text-left">
                    <div className="flex justify-between items-center">
                      <p className="mb-0 text-sm">{product.category_name}</p>
                      <div className="flex items-center">
                        <Star stars={product.average_rating} />
                        <span className="text-gray-500 ml-1">{product.reviews}</span>
                      </div>
                    </div>
                    <h6 className="text-lg font-semibold">
                      <Link to={`/shop-detail/${product.ProductID}`}>{product.ProductName}</Link>
                    </h6>
                    <div className="flex justify-start">
                      <span className="text-lg font-bold text-red-600">{product.SalePrice}₫</span>
                      {product.Price && (
                        <span className="text-sm line-through text-gray-500 ml-2">{product.Price}₫</span>
                      )}
                    </div>
                  </div>

                  {/* Nút yêu thích */}
                  <button
                    className="absolute top-0 right-0 bg-transparent border-0"
                    title="Thêm vào danh sách yêu thích"
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