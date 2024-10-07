import React from 'react';

const Shop = () => {
  return (
    <div>
      <div>
        <main className="container mx-auto px-4 py-16">
          <div
            className="d-flex justify-content-between mb-4 pb-md-2"
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '8px' }}
          >
            <div
              className="breadcrumb mb-0 d-none d-md-block flex-grow-1"
              style={{ fontSize: '12px', fontWeight: '500', color: '#333' }}
            >
              <a
                href="#"
                className="menu-link menu-link_us-s text-uppercase fw-medium"
                style={{ textTransform: 'uppercase', fontWeight: '500', color: '#333' }}
              >
                Home
              </a>
              <span
                className="breadcrumb-separator menu-link fw-medium ps-1 pe-1"
                style={{ marginLeft: '8px', marginRight: '8px', color: '#888' }}
              >
                /
              </span>
              <a
                href="#"
                className="menu-link menu-link_us-s text-uppercase fw-medium"
                style={{ textTransform: 'uppercase', fontWeight: '500', color: '#333' }}
              >
                The Shop
              </a>
            </div>
            <div
              className="shop-acs d-flex align-items-center justify-content-between flex-grow-1"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <select
                className="shop-acs__select form-select w-auto border-0 py-0"
                aria-label="Sort Items"
                name="total-number"
                style={{
                  marginRight: '15px',
                  backgroundColor: '#f8f8f8',
                  border: '1px solid #e0e0e0',
                  fontSize: '12px',
                  color: '#333',
                  padding: '5px 10px',
                }}
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

              <div className="col-size align-items-center d-flex" style={{ display: 'flex', alignItems: 'center' }}>
                <span className="text-uppercase fw-medium me-2" style={{ fontSize: '12px', color: '#333' }}>
                  View
                </span>
                <button
                  className="btn-link fw-medium me-2 js-cols-size"
                  style={{ background: 'none', border: 'none', fontSize: '12px', color: '#333', padding: '5px' }}
                >
                  2
                </button>
                <button
                  className="btn-link fw-medium me-2 js-cols-size"
                  style={{ background: 'none', border: 'none', fontSize: '12px', color: '#333', padding: '5px' }}
                >
                  3
                </button>
                <button
                  className="btn-link fw-medium me-2 js-cols-size btn-link_active"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    color: '#000',
                    fontWeight: 'bold',
                    padding: '5px',
                  }}
                >
                  4
                </button>
              </div>

              <div className="shop-filter d-flex align-items-center" style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  className="btn-link btn-link_f d-flex align-items-center ps-0 js-open-aside"
                  style={{
                    fontSize: '12px',
                    color: '#333',
                    background: 'none',
                    border: 'none',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <svg
                    className="d-inline-block align-middle me-2"
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: '8px' }}
                  >
                    <use href="#icon_filter"></use>
                  </svg>
                  <span className="text-uppercase fw-medium d-inline-block align-middle">Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
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

          {/* Pagination & Discover More */}
          <p className="mb-5 text-center fw-medium" style={{ textAlign: 'center', fontWeight: '500', marginBottom: '16px' }}>
            SHOWING 36 of 497 items
          </p>
          <div className="text-center mt-8" style={{ textAlign: 'center', marginTop: '32px' }}>
            <a className="text-black font-semibold" href="#" style={{ color: '#000', fontWeight: '600' }}>
              DISCOVER MORE
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;
