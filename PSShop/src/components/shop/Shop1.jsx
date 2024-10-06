import React from 'react';

const Shop = () => {
  return (
    <div>
      <div>
        <main className="container mx-auto px-4 py-16">
          <div className="d-flex justify-content-between mb-4 pb-md-2">
            <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
              <a href="#" className="menu-link menu-link_us-s text-uppercase fw-medium">Home</a>
              <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">/</span>
              <a href="#" className="menu-link menu-link_us-s text-uppercase fw-medium">The Shop</a>
            </div>
            <div
              className="shop-acs d-flex align-items-center justify-content-between flex-grow-1"
              style={{
                display: 'flex',
                alignItems: 'center',
              
              }}
            >
              <select
                className="shop-acs__select form-select w-auto border-0 py-0"
                aria-label="Sort Items"
                name="total-number"
                style={{ marginRight: '15px' }} 
              >
                <option value="">Default Sorting</option>
                <option value="1">Featured</option>
                <option value="2">Best selling</option>
                <option value="3">Alphabetically, A-Z</option>
                <option value="4">Alphabetically, Z-A</option>
                <option value="5">Price, low to high</option>
                <option value="6">Price, high to low</option>
                <option value="7">Date, old to new</option>
                <option value="8">Date, new to old</option>
              </select>

              <div className="col-size align-items-center d-flex">
                <span className="text-uppercase fw-medium me-2">View</span>
                <button className="btn-link fw-medium me-2 js-cols-size">2</button>
                <button className="btn-link fw-medium me-2 js-cols-size">3</button>
                <button className="btn-link fw-medium me-2 js-cols-size btn-link_active">4</button>
              </div>

              <div className="shop-filter d-flex align-items-center">
                <button className="btn-link btn-link_f d-flex align-items-center ps-0 js-open-aside">
                  <svg
                    className="d-inline-block align-middle me-2"
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use href="#icon_filter"></use>
                  </svg>
                  <span className="text-uppercase fw-medium d-inline-block align-middle">Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative">
                <img alt="Cropped Faux Leather Jacket" className="w-full" height="400" src="https://placehold.co/400x485" width="300" />
                <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2">
                  ADD TO CART
                </button>
              </div>
              <p className="text-gray-500 mt-4">Dresses</p>
              <p className="text-black font-bold">Cropped Faux Leather Jacket</p>
              <p className="text-black">$29</p>
              <div className="flex justify-center items-center mt-2">
                <i className="fas fa-star text-yellow-500"></i>
                <i className="fas fa-star text-yellow-500"></i>
                <i className="fas fa-star text-yellow-500"></i>
                <i className="fas fa-star text-yellow-500"></i>
                <i className="fas fa-star text-yellow-500"></i>
                <p className="text-gray-500 ml-2">8k+ reviews</p>
              </div>
            </div>

            <div className="text-center relative">
              <img alt="Calvin Shorts" className="w-full" height="400" src="https://placehold.co/400x485" width="300" />
              <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1">-67%</span> {/* Discount Label */}
              <p className="text-gray-500 mt-4">Dresses</p>
              <p className="text-black font-bold">Calvin Shorts</p>
              <p className="text-black">$62</p>           
              <div className="d-flex align-items-center mt-1">
                <a className="swatch-color pc__swatch-color swatch_active" style={{ backgroundColor: 'rgb(186, 186, 186)' }}></a>
                <a className="swatch-color pc__swatch-color" style={{ backgroundColor: 'rgb(215, 107, 103)' }}></a>
                <a className="swatch-color pc__swatch-color" style={{ backgroundColor: 'rgb(191, 220, 196)' }}></a>
              </div>
            </div>

            <div className="text-center">
              <img alt="Kirby T-Shirt" className="w-full" height="400" src="https://placehold.co/400x485" width="300" />
              <p className="text-gray-500 mt-4">Dresses</p>
              <p className="text-black font-bold">Kirby T-Shirt</p>
              <p className="text-black">$17</p>
            </div>

            <div className="text-center relative">
              <img alt="Cableknit Shawl" className="w-full" height="400" src="https://placehold.co/400x485" width="300" />
              <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1">NEW</span> {/* New Product Label */}
              <p className="text-gray-500 mt-4">Dresses</p>
              <p className="text-black font-bold">Cableknit Shawl</p>
              <p className="text-red-500">
                <span className="line-through text-gray-500">$129</span> $99
              </p>
            </div>
          </div>

          {/* Pagination & Discover More */}
          <p className="mb-5 text-center fw-medium">SHOWING 36 of 497 items</p>
          <div className="text-center mt-8">
            <a className="text-black font-semibold" href="#">
              DISCOVER MORE
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;
