import { useEffect, useState } from "react";
import Star from "../common/Star";
import { Link } from "react-router-dom";
import { useContextElement } from "../../context/Context";
import BreadCumb from "./BreadCumb";
import Pagination1 from "../common/Pagination1";
import { openModalShopFilter } from "../../utlis/aside";
import FilterAll from "./filter/FilterAll";
import axios from "axios";

const itemPerRow = [2, 3, 4];

export default function Shop1() {
  const menuCategories = [
    "All",
    "StayHome",
    "Jackets",
    "Hoodies",
    "Men",
    "Women",
    "Accessories",
    "Shoes",
  ];
  const sortingOptions = [
    { label: "Default Sorting", value: "", selected: true },
    { label: "Featured", value: "1" },
    { label: "Best selling", value: "2" },
    { label: "Alphabetically, A-Z", value: "3" },
    { label: "Alphabetically, Z-A", value: "4" },
    { label: "Price, low to high", value: "5" },
    { label: "Price, high to low", value: "6" },
    { label: "Date, old to new", value: "7" },
    { label: "Date, new to old", value: "8" },
  ];

  const [filters, setFilters] = useState({}); // State cho bộ lọc
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters); // Cập nhật bộ lọc
  };


  const { toggleWishlist, isInWishlist } = useContextElement();
  const [selectedColView, setSelectedColView] = useState(3);
  const [currentCategory] = useState(menuCategories[0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products");
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

  
  // Lọc sản phẩm dựa trên bộ lọc đã chọn
  const filteredProducts = products.filter((product) => {
    console.log("Current filters:", filters);
    const matchesCategory =
      !filters.categoryId || product.CategoryID === filters.categoryId;
    const matchesColor =
      !filters.colorId || product.ColorID === filters.colorId; 
    const matchesSize =
      !filters.sizeId || product.SizeID === filters.sizeId;

    return matchesCategory && matchesColor && matchesSize;
  });

  return (
    <>
      <div className="mb-4 pb-lg-3"></div>
      <section className="shop-main container d-flex">
        <div className="shop-sidebar side-sticky bg-body">
          <div
            onClick={openModalShopFilter}
            className="aside-header d-flex d-lg-none align-items-center"
          >
            <h3 className="text-uppercase fs-6 mb-0">Filter By</h3>
            <button className="btn-close-lg js-close-aside btn-close-aside ms-auto"></button>
          </div>
          <FilterAll onFilterChange={handleFilterChange} />
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
                    className={`btn-link fw-medium me-2 js-cols-size ${
                      selectedColView === elm ? "btn-link_active" : ""
                    }`}
                  >
                    {elm}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div
            className={`products-grid row row-cols-2 row-cols-md-3 row-cols-lg-${selectedColView}`}
            id="products-grid"
          >
            {filteredProducts.map((elm, i) => (
              <div key={i} className="product-card-wrapper">
                <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                  <div className="pc__img-wrapper">
                      <Link to={`/shop-detail/${elm.ProductID}`}>
                        <img
                          loading="lazy"
                          src={elm.MainImageURL}
                          width="330"
                          height="400"
                          alt={elm.ProductName}
                          className="pc__img"
                        />
                        {elm.discount_percentage > 0 && (
                          <span className="discount-label position-absolute top-0 start-0 m-1 border border-light bg-red-600 text-white p-1 rounded">
                            -{elm.discount_percentage}%
                          </span>
                        )}
                      </Link>
                    </div>

                    <div className="p-2 text-left">
                      <div className="flex justify-between items-center">
                        <p className="mb-0 text-sm">{elm.category_name}</p>
                        <div className="flex items-center">
                          <Star stars={elm.average_rating} />
                          <span className="text-gray-500 ml-1">
                            {elm.reviews}
                          </span>
                        </div>
                      </div>
                      <h6 className="text-lg font-semibold">
                        <Link to={`/shop-detail/${elm.ProductID}`}>
                          {elm.ProductName}
                        </Link>
                      </h6>
                      <div className="flex justify-start">
                        <span className="text-lg font-bold text-red-600">
                          {elm.SalePrice}₫
                        </span>
                        {elm.Price && (
                          <span className="text-sm line-through text-gray-500 ml-2">
                            {elm.Price}₫
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {elm.ShortDescription}
                      </p>
                    </div>

                    <button
                      className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${
                        isInWishlist(elm.ProductID) ? "active" : ""
                      }`}
                      onClick={() => toggleWishlist(elm.ProductID)}
                      title="Add To Wishlist"
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
          <Pagination1 />
        </div>
      </section>
    </>
  );
}
