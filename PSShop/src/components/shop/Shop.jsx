import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ColorSelection from "../common/ColorSelection";
import Star from "../common/Star";
import { Link } from "react-router-dom";
import { useContextElement } from "../../context/Context";
import BreadCumb from "./BreadCumb";
import Pagination1 from "../common/Pagination1";
import { openModalShopFilter } from "../../utlis/aside";
import { menuCategories, sortingOptions } from "../../data/products/productCategories";
import FilterAll from "./filter/FilterAll";
import axios from 'axios'; 
import Swal from "sweetalert2";

const itemPerRow = [2, 3, 4];

export default function Shop1() {
  const { toggleWishlist, isInWishlist } = useContextElement();
  const [selectedColView, setSelectedColView] = useState(3);
  const [currentCategory, setCurrentCategory] = useState(menuCategories[0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products');
        setProducts(response.data.data || response.data.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi API", error);
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="full-width_padding">
        <div className="full-width_border border-2" style={{ borderColor: "#f5e6e0" }}>
          <div className="shop-banner position-relative">
            <div className="background-img" style={{ backgroundColor: "#f5e6e0" }}>
              <img
                loading="lazy"
                src="/assets/images/shop/shop_banner_2.png"
                width="1759"
                height="420"
                alt="Pattern"
                className="slideshow-bg__img object-fit-cover"
              />
            </div>
            <div className="shop-banner__content container position-absolute start-50 top-50 translate-middle">
              <h2 className="h1 text-uppercase text-center fw-bold mb-3 mb-xl-4 mb-xl-5">
                Shoes
              </h2>
              <ul className="d-flex justify-content-center flex-wrap list-unstyled text-uppercase h6">
                {menuCategories.map((elm, i) => (
                  <li key={i} className="me-3 me-xl-4 pe-1">
                    <a
                      onClick={() => setCurrentCategory(elm)}
                      className={`menu-link menu-link_us-s ${currentCategory === elm ? "menu-link_active" : ""}`}
                    >
                      {elm}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="mb-4 pb-lg-3"></div>
      <section className="shop-main container d-flex">
        <div className="shop-sidebar side-sticky bg-body">
          <div onClick={openModalShopFilter} className="aside-header d-flex d-lg-none align-items-center">
            <h3 className="text-uppercase fs-6 mb-0">Filter By</h3>
            <button className="btn-close-lg js-close-aside btn-close-aside ms-auto"></button>
          </div>
          <FilterAll />
        </div>

        <div className="shop-list flex-grow-1">
          <div className="d-flex justify-content-between mb-4 pb-md-2">
            <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
              <BreadCumb />
            </div>
            <div className="shop-acs d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
              <select
                className="shop-acs__select form-select w-auto border-0 py-0 order-1 order-md-0"
                aria-label="Sort Items"
                name="total-number"
              >
                {sortingOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="shop-asc__seprator mx-3 bg-light d-none d-md-block order-md-0"></div>
              <div className="col-size align-items-center order-1 d-none d-lg-flex">
                <span className="text-uppercase fw-medium me-2">View</span>
                {itemPerRow.map((elm, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColView(elm)}
                    className={`btn-link fw-medium me-2 js-cols-size ${selectedColView === elm ? "btn-link_active" : ""}`}
                  >
                    {elm}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`products-grid row row-cols-2 row-cols-md-3 row-cols-lg-${selectedColView}`} id="products-grid">
            {products.filter(elm => currentCategory === "All" || elm.filterCategory2 === currentCategory).map((elm, i) => (
              <div key={i} className="product-card-wrapper">
                <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                  <div className="pc__img-wrapper">
                    <Swiper
                      className="shop-list-swiper swiper-container background-img js-swiper-slider"
                      slidesPerView={1}
                      modules={[Navigation]}
                      navigation={{
                        prevEl: ".prev" + i,
                        nextEl: ".next" + i,
                      }}
                    >
                      {[elm.MainImageURL, elm.imgSrc2].map((elm2, j) => (
                        <SwiperSlide key={j} className="swiper-slide">
                          <Link to={`/shop-detail/${elm.ProductID}`}>
                            <img
                              loading="lazy"
                              src={elm2}
                              width="330"
                              height="400"
                              alt={elm.ProductName}
                              className="pc__img"
                            />
                          </Link>
                        </SwiperSlide>
                      ))}
                      <span className={`cursor-pointer pc__img-prev ${"prev" + i} `}>
                        <svg width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg">
                          <use href="#icon_prev_sm" />
                        </svg>
                      </span>
                      <span className={`cursor-pointer pc__img-next ${"next" + i} `}>
                        <svg width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg">
                          <use href="#icon_next_sm" />
                        </svg>
                      </span>
                    </Swiper>
                  </div>

                  <div className="pc__info position-relative">
                    <p className="pc__category">{elm.category_name}</p>
                    <h6 className="pc__title">
                      <Link to={`/shop-detail/${elm.ProductID}`}>{elm.ProductName}</Link>
                    </h6>
                    <div className="product-card__price d-flex">
                      {elm.priceOld ? (
                        <>
                          <span className="money price price-old">${elm.priceOld}</span>
                          <span className="money price price-sale">${elm.Price}</span>
                        </>
                      ) : (
                        <span className="money price">${elm.Price}</span>
                      )}
                    </div>
                    {elm.colors && (
                      <div className="d-flex align-items-center mt-1">
                        <ColorSelection />
                      </div>
                    )}
                    {elm.reviews && (
                      <div className="product-card__review d-flex align-items-center">
                        <div className="reviews-group d-flex">
                          <Star stars={elm.rating} />
                        </div>
                        <span className="reviews-note text-lowercase text-secondary ms-1">
                          {elm.reviews}
                        </span>
                      </div>
                    )}
                    <button
                      className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${isInWishlist(elm.ProductID) ? "active" : ""}`}
                      onClick={() => toggleWishlist(elm.ProductID)}
                      title="Add To Wishlist"
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <use href="#icon_heart" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination1 />
        </div>
      </section>
    </>
  );
}