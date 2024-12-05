import { useEffect, useState, useCallback } from "react";
import Star from "../common/Star";
import { Link } from "react-router-dom";
import { useContextElement } from "../../context/Context";
import BreadCumb from "./BreadCumb";
import { openModalShopFilter } from "../../utlis/aside";
import FilterAll from "./filter/FilterAll";
import axios from "axios";
import ReactPaginate from "react-paginate";

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

  const [selectedColView, setSelectedColView] = useState(3);
  const [currentCategory] = useState(menuCategories[0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState({});
  const [categoryId, setCategoryID] = useState({});
  const [colorId, setColorID] = useState({});
  const [sizeId, setSizeID] = useState({});
  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useContextElement(); // Di chuyển vào trong hàm

  const fetchProducts = async (page, categoryId, colorId, sizeId) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/products/index",
        {
          Page: page,
          Limit: 12,
          CategoryID: categoryId,
          ColorID: colorId,
          SizeID: sizeId,
        }
      );
      setProducts(response.data.data);
      setPage(response.data.page);
      setTotalPage(response.data.totalPage);
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi API", error);
      setError("Không thể tải sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, categoryId, colorId, sizeId);
  }, [page, categoryId, colorId, sizeId]);

  const handleFilterChange = (newFilters) => {
    setColorID(newFilters.colorId);
    setCategoryID(newFilters.categoryId);
    setSizeID(newFilters.sizeId);
    console.log(newFilters);
    console.log(newFilters.categoryId);
    console.log(newFilters.colorId);
    console.log(newFilters.sizeId);
    // setFilters(newFilters);
  };

  const handlePageClick = useCallback((event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
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
              <div className="shop-asc__seprator mx-3 bg-light d-none d-md-block order-md-0"></div>
              <div className="col-size align-items-center order-1 d-none d-lg-flex">
                <span className="text-uppercase fw-medium me-2">Xem</span>
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
            {products.map((elm, i) => (
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
                      <Link to={`/shop-detail/${elm.ProductID}`}>
                        <button className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside">
                          Xem chi tiết
                        </button>
                      </Link>
                      {elm.discount_percentage > 0 && ( // Hiển thị mã giảm giá nếu có
                        <span className="absolute top-3 left-0 h-[30px] w-[53px] bg-red-600 text-white p-1 rounded">
                          -{elm.discount_percentage}%
                        </span>
                      )}
                      {new Date(elm.created_at) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) &&
                        elm.ProductID && ( // Kiểm tra xem sản phẩm có được tạo trong 7 ngày qua không và có mã
                          <div className="absolute top-12 left-0  product-label bg-white text-dark">
                            NEW
                          </div>
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
                    <div className="flex justify-between">
                      <h6 className="text-lg font-semibold">
                        <Link to={`/shop-detail/${elm.ProductID}`}>
                          {elm.ProductName}
                        </Link>
                      </h6>
                      <button
                        title="Add To Wishlist"
                        className={`transition-transform duration-200 hover:scale-110 active:scale-95 ${
                          isInWishlist(elm.ProductID) ||
                          wishlistStatus[elm.ProductID]
                            ? "active"
                            : ""
                        }`}
                        onClick={() => toggleWishlist(elm.ProductID)} // Gọi hàm toggleWishlist
                      >
                        <svg
                          width="25px"
                          height="25px"
                          className=""
                          viewBox="0 0 64 64"
                          xmlns="http://www.w3.org/2000/svg"
                          stroke="#000000"
                          fill={
                            isInWishlist(elm.ProductID) ||
                            wishlistStatus[elm.ProductID]
                              ? "red"
                              : "none"
                          } // Thay đổi màu sắc
                        >
                          <path d="M9.06,25C7.68,17.3,12.78,10.63,20.73,10c7-.55,10.47,7.93,11.17,9.55a.13.13,0,0,0,.25,0c3.25-8.91,9.17-9.29,11.25-9.5C49,9.45,56.51,13.78,55,23.87c-2.16,14-23.12,29.81-23.12,29.81S11.79,40.05,9.06,25Z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex justify-start">
                      <span className="text-lg font-bold text-red-600">
                        {Math.floor(elm.SalePrice)}₫
                      </span>
                      {elm.Price && (
                        <span className="text-sm mt-1 line-through text-gray-500 ml-2">
                          {Math.floor(elm.Price)}₫
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600">
                      Đã bán: {elm.total_sold}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination flex justify-center mt-4">
            {totalPage > 1 && (
              <ReactPaginate
                breakLabel="..."
                nextLabel=" >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={totalPage}
                previousLabel="<"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination flex justify-center space-x-2 mt-4"
                activeClassName="active bg-blue-500 text-white"
                forcePage={page - 1}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
