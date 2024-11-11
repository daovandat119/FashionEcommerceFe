import { Swiper, SwiperSlide } from "swiper/react";
import Star from "../common/Star";
import ColorSelection from "../common/ColorSelection";
import { Navigation } from "swiper/modules";
import Pagination1 from "../common/Pagination1";
import { useEffect, useState } from "react";
import BreadCumb from "./BreadCumb";
import { Link } from "react-router-dom";
import axios from 'axios'; 
import { openModalShopFilter } from "../../utlis/aside";
import { menuCategories, sortingOptions } from "../../data/products/productCategories";
import { useContextElement } from "../../context/Context";
import Swal from "sweetalert2";

const itemPerRow = [2, 3, 4];

export default function Shop1() {
  const [selectedColView, setSelectedColView] = useState(4);
  const [currentCategory] = useState(menuCategories[0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { 
    addToWishlist,
    removeFromWishlist, 
    isInWishlist,
    isLoadingWishlist,
    fetchWishlistItems,
  } = useContextElement();

  const [wishlistLoadingStates, setWishlistLoadingStates] = useState({});
  const [wishlistStates, setWishlistStates] = useState({});

  useEffect(() => {
    const initializeWishlist = async () => {
      try {
        await fetchWishlistItems();
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    initializeWishlist();
  }, [fetchWishlistItems]);

  useEffect(() => {
    if (products && Array.isArray(products) && typeof isInWishlist === 'function') {
      const newWishlistStates = {};
      products.forEach(product => {
        newWishlistStates[product.ProductID] = isInWishlist(product.ProductID);
      });
      setWishlistStates(newWishlistStates);
    }
  }, [products, isInWishlist]);

  const handleWishlistToggle = async (productId) => {
    if (wishlistLoadingStates[productId]) return;

    try {
      setWishlistLoadingStates(prev => ({ ...prev, [productId]: true }));
      
      if (!localStorage.getItem("token")) {
        Swal.fire({
          title: "Thông báo",
          text: "Vui lòng đăng nhập để sử dụng tính năng này",
          icon: "warning"
        });
        return;
      }

      const isCurrentlyInWishlist = wishlistStates[productId];

      if (isCurrentlyInWishlist) {
        await removeFromWishlist(productId);
        setWishlistStates(prev => ({ ...prev, [productId]: false }));
        Swal.fire({
          title: "Thành công",
          text: "Đã xóa khỏi danh sách yêu thích",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        await addToWishlist(productId);
        setWishlistStates(prev => ({ ...prev, [productId]: true }));
        Swal.fire({
          title: "Thành công",
          text: "Đã thêm vào danh sách yêu thích",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error("Error handling wishlist:", error);
      Swal.fire({
        title: "Lỗi",
        text: error.message || "Có lỗi xảy ra, vui lòng thử lại",
        icon: "error"
      });
    } finally {
      setWishlistLoadingStates(prev => ({ ...prev, [productId]: false }));
    }
  };

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

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Không có sản phẩm nào</div>
      </div>
    );
  }

  return (
    <>
      <section className="full-width_padding"></section>
      <div className="mb-4 pb-lg-3"></div>
      <section className="shop-main container">
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
                  className={`btn-link fw-medium me-2 js-cols-size ${
                    selectedColView === elm ? "btn-link_active" : ""
                  } `}
                >
                  {elm}
                </button>
              ))}
            </div>

            <div className="shop-asc__seprator mx-3 bg-light d-none d-lg-block order-md-1"></div>

            <div className="shop-filter d-flex align-items-center order-0 order-md-3">
              <button
                className="btn-link btn-link_f d-flex align-items-center ps-0 js-open-aside"
                onClick={openModalShopFilter}
              >
                <svg
                  className="d-inline-block align-middle me-2"
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_filter" />
                </svg>
                <span className="text-uppercase fw-medium d-inline-block align-middle">
                  Filter
                </span>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`products-grid row row-cols-2 row-cols-md-3 row-cols-lg-${selectedColView}`}
          id="products-grid"
        >
          {Array.isArray(products) && products.filter(elm => 
            currentCategory === "All" || elm.filterCategory2 === currentCategory
          ).map((elm, i) => (
            <div key={i} className="product-card-wrapper">
              <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                <div className="pc__img-wrapper">
                  <Swiper
                    className="shop-list-swiper swiper-container swiper-initialized swiper-horizontal swiper-backface-hidden background-img js-swiper-slider"
                    slidesPerView={1}
                    modules={[Navigation]}
                    navigation={{
                      prevEl: ".prev" + i,
                      nextEl: ".next" + i,
                    }}
                  >
                    {[elm.MainImageURL].map((elm2, j) => (
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
                  {/* <button
                    className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                    
                    title={isAddedToCartProducts(elm.id) ? "Already Added" : "Add to Cart"}
                  >
                    {isAddedToCartProducts(elm.id) ? "Already Added" : "Add To Cart"}
                  </button> */}
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
                    onClick={() => handleWishlistToggle(elm.ProductID)}
                    disabled={wishlistLoadingStates[elm.ProductID] || isLoadingWishlist}
                    className={`
                      pc__btn-wl position-absolute top-0 end-0 
                      bg-transparent border-0 
                      transition-all duration-300
                      ${wishlistLoadingStates[elm.ProductID] || isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                    `}
                  >
                    <i 
                      className={`
                        fas 
                        ${wishlistLoadingStates[elm.ProductID] ? 'fa-spinner fa-spin' : 'fa-heart'} 
                        ${wishlistStates[elm.ProductID] ? 'text-red-500 animate-heartBeat' : 'text-gray-400'}
                        transition-all duration-300
                      `}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination1 />
      </section>
    </>
  );
}
