import { menuCategories } from "../../data/products/productCategories";
import { useState } from "react";
import { openModalShopFilter } from "../../utlis/aside";
import FilterAll from "./filter/FilterAll";
import BreadCumb from "./BreadCumb";
import { sortingOptions } from "../../data/products/productCategories";

const Shop2 = () => { 
    const itemPerRow = [2, 3, 4];
    const [currentCategory, setCurrentCategory] = useState(menuCategories[0]);
    const [selectedColView, setSelectedColView] = useState(3);

    return(
        <section className="full-width_padding">
        <div
          className="full-width_border border-2"
          style={{ borderColor: "#f5e6e0" }}
        >
          <div className="shop-banner position-relative">
            <div
              className="background-img"
              style={{ backgroundColor: "#f5e6e0" }}
            >
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
                      className={`menu-link menu-link_us-s ${
                        currentCategory == elm ? "menu-link_active" : ""
                      }`}
                    >
                      {elm}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {}
          </div>
          {}
        </div>
        {}

        <div className="mb-4 pb-lg-3"></div>

        <section className="shop-main container d-flex">
        {/* <div className="shop-sidebar side-sticky bg-body">
          <div
            onClick={openModalShopFilter}
            className="aside-header d-flex d-lg-none align-items-center"
          >
            <h3 className="text-uppercase fs-6 mb-0">Filter By</h3>
            <button className="btn-close-lg js-close-aside btn-close-aside ms-auto"></button>
          </div>

          <div className="pt-4 pt-lg-0"></div>

          <FilterAll />
        </div> */}

        <div class="shop-sidebar side-sticky bg-body">
            <div class="aside-header d-flex d-lg-none align-items-center">
                <h3 class="text-uppercase fs-6 mb-0">Filter By</h3>
                <button class="btn-close-lg js-close-aside btn-close-aside ms-auto"></button>
            </div>
                <div class="pt-4 pt-lg-0"></div>
                <div class="accordion" id="categories-list">
                    <div class="accordion-item mb-4">
                        <h5>Product Categories</h5>
                            {/* <div id="accordion-filter-1" class="accordion-collapse collapse show border-0" aria-labelledby="accordion-heading-11" data-bs-parent="#categories-list">
                                <div class="accordion-body px-0 pb-0">
                                    <ul class="list list-inline row row-cols-2 mb-0">
                                        <li class="list-item"><a href="#" class="menu-link py-1">Dresses</a></li>
                                        <li class="list-item"><a href="#" class="menu-link py-1">Shorts</a>
                                        </li><li class="list-item"><a href="#" class="menu-link py-1">Sweatshirts</a>
                                        </li><li class="list-item"><a href="#" class="menu-link py-1">Swimwear</a>
                                        </li><li class="list-item"><a href="#" class="menu-link py-1">Jackets</a>
                                        </li><li class="list-item"><a href="#" class="menu-link py-1">T-Shirts &amp; Tops</a>
                                        </li><li class="list-item"><a href="#" class="menu-link py-1">Jeans</a>
                                        </li><li class="list-item"><a href="#" class="menu-link py-1">Trousers</a>
                                        </li><li class="list-item"><a href="#" class="menu-link py-1">Men</a>
                                        </li><li class="list-item"><a href="#" class="menu-link py-1">Jumpers &amp; Cardigans</a>
                                        </li>
                                    </ul>
                                </div>
                            </div> */}
                    </div>
                </div>  
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
                      selectedColView == elm ? "btn-link_active" : ""
                    } `}
                  >
                    {elm}
                  </button>
                ))}
              </div>
              <div className="shop-filter d-flex align-items-center order-0 order-md-3 d-lg-none">
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
              {}
            </div>
            {}
          </div>
          {}
          <div className="grid grid-cols-4 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <div className="text-center">
              <div className="relative">
                <img
                  alt="Cropped Faux Leather Jacket"
                  className="w-full"
                  height="400"
                  src="https://placehold.co/400x485"
                  width="300"
                />
                <button
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2"
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#fff',
                    color: '#000',
                    padding: '8px 16px',
                  }}
                >
                  ADD TO CART
                </button>
              </div>
              <p className="text-gray-500 mt-4" style={{ color: '#888', marginTop: '16px' }}>
                Dresses
              </p>
              <p className="text-black font-bold" style={{ color: '#000', fontWeight: 'bold' }}>
                Cropped Faux Leather Jacket
              </p>
              <p className="text-black" style={{ color: '#000' }}>$29</p>
              <div className="flex justify-center items-center mt-2" style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                <i className="fas fa-star text-yellow-500" style={{ color: '#f1c40f' }}></i>
                <i className="fas fa-star text-yellow-500" style={{ color: '#f1c40f' }}></i>
                <i className="fas fa-star text-yellow-500" style={{ color: '#f1c40f' }}></i>
                <i className="fas fa-star text-yellow-500" style={{ color: '#f1c40f' }}></i>
                <i className="fas fa-star text-yellow-500" style={{ color: '#f1c40f' }}></i>
                <p className="text-gray-500 ml-2" style={{ color: '#888', marginLeft: '8px' }}>8k+ reviews</p>
              </div>
            </div>

            <div className="text-center relative">
              <img
                alt="Calvin Shorts"
                className="w-full"
                height="400"
                src="https://placehold.co/400x485"
                width="300"
              />
              <span
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  padding: '2px 8px',
                }}
              >
                -67%
              </span>
              <p className="text-gray-500 mt-4" style={{ color: '#888', marginTop: '16px' }}>
                Dresses
              </p>
              <p className="text-black font-bold" style={{ color: '#000', fontWeight: 'bold' }}>
                Calvin Shorts
              </p>
              <p className="text-black" style={{ color: '#000' }}>$62</p>
              <div className="d-flex align-items-center mt-1" style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                <a
                  className="swatch-color pc__swatch-color swatch_active"
                  style={{ backgroundColor: 'rgb(186, 186, 186)', display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', margin: '0 4px' }}
                ></a>
                <a
                  className="swatch-color pc__swatch-color"
                  style={{ backgroundColor: 'rgb(215, 107, 103)', display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', margin: '0 4px' }}
                ></a>
                <a
                  className="swatch-color pc__swatch-color"
                  style={{ backgroundColor: 'rgb(191, 220, 196)', display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', margin: '0 4px' }}
                ></a>
              </div>
            </div>

            <div className="text-center">
              <img
                alt="Kirby T-Shirt"
                className="w-full"
                height="400"
                src="https://placehold.co/400x485"
                width="300"
              />
              <p className="text-gray-500 mt-4" style={{ color: '#888', marginTop: '16px' }}>
                Dresses
              </p>
              <p className="text-black font-bold" style={{ color: '#000', fontWeight: 'bold' }}>
                Kirby T-Shirt
              </p>
              <p className="text-black" style={{ color: '#000' }}>$17</p>
            </div>

            <div className="text-center relative">
              <img
                alt="Cableknit Shawl"
                className="w-full"
                height="400"
                src="https://placehold.co/400x485"
                width="300"
              />
              <span
                className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#2ecc71',
                  color: '#fff',
                  padding: '2px 8px',
                }}
              >
                NEW
              </span>
              <p className="text-gray-500 mt-4" style={{ color: '#888', marginTop: '16px' }}>
                Dresses
              </p>
              <p className="text-black font-bold" style={{ color: '#000', fontWeight: 'bold' }}>
                Cableknit Shawl
              </p>
              <p className="text-red-500" style={{ color: '#e74c3c' }}>
                <span className="line-through text-gray-500" style={{ textDecoration: 'line-through', color: '#888' }}>
                  $129
                </span>{' '}
                $99
              </p>
            </div>
          </div>
        </div>
      </section>{" "}
      </section>    
    )
}
export default Shop2;