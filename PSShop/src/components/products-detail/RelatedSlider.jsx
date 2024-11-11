import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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

  useEffect(() => {
    // Gọi API PHP từ React
    axios.get('http://127.0.0.1:8000/api/products')
      .then(response => {
        setProducts(response.data.data || response.data); // Điều chỉnh nếu cần
        setLoading(false);
      })
      .catch(error => {
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
                  <button
                    className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                    title="Add to Cart"
                    // Thêm logic thêm vào giỏ hàng nếu cần
                  >
                    Add To Cart
                  </button>
                </div>

                <div className="pc__info position-relative">
                  <p className="pc__category">{product.category_name}</p>
                  <h6 className="pc__title">
                    <Link to={`/shop-detail/${product.ProductName}`}>{product.ProductName}</Link>
                  </h6>
                  <div className="product-card__price d-flex">
                    <span className="money price">{product.Price}$</span>
                  </div>
                  {product.reviews && (
                    <div className="product-card__review d-flex align-items-center">
                      <div className="reviews-group d-flex">
                        {/* Hiển thị đánh giá ở đây */}
                      </div>
                      <span className="reviews-note text-lowercase text-secondary ms-1">
                        {product.reviews}
                      </span>
                    </div>
                  )}

                  <button
                    className="pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist"
                    title="Add To Wishlist"
                    // Thêm logic thêm vào danh sách yêu thích nếu cần
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
        
        <div className="products-carousel__prev cursor-pointer position-absolute top-50 start-0 translate-middle-y z-1 bg-white rounded-circle shadow d-flex align-items-center justify-content-center" 
             style={{ width: '40px', height: '40px', left: '-20px' }}>
          <svg width="20" height="20" viewBox="0 0 25 25">
            <use href="#icon_prev_md" />
          </svg>
        </div>
        
        <div className="products-carousel__next cursor-pointer position-absolute top-50 end-0 translate-middle-y z-1 bg-white rounded-circle shadow d-flex align-items-center justify-content-center"
             style={{ width: '40px', height: '40px', right: '-20px' }}>
          <svg width="20" height="20" viewBox="0 0 25 25">
            <use href="#icon_next_md" />
          </svg>
        </div>
        
        <div className="products-pagination mt-4 d-flex align-items-center justify-content-center"></div>
      </div>
    </section>
  );
}
