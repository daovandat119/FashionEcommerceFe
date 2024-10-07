import React from 'react';
import BreadCumb from './BreadCumb';
import { sortingOptions } from '../../data/products/productCategories';
import {  useState } from "react";
import { openModalShopFilter } from '../../utlis/aside';
import Pagination1 from '../common/Pagination1';
const Shop1 = () => {
  const [selectedColView, setSelectedColView] = useState(4);
  const itemPerRow = [2, 3, 4];
  return (
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
                    selectedColView == elm ? "btn-link_active" : ""
                  } `}
                >
                  {elm}
                </button>
              ))}
            </div>
            {}

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
            {}
          </div>
          {}
        </div>

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



          <p className="mb-5 text-center fw-medium">SHOWING 36 of 497 items</p>
        <Pagination1 />

        <div className="text-center">
          <a className="btn-link btn-link_lg text-uppercase fw-medium" href="#">
            Show More
          </a>
        </div>
        </section>  



  );
};

export default Shop1;
