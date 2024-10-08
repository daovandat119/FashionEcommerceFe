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
                <div className="grid grid-cols-4 gap-8">
                    <div className="relative group">
                            <img
                                alt="Woman wearing a cropped faux leather jacket"
                                className="w-full"
                                height="400"
                                src="https://placehold.co/400x485"
                                width="300"
                            />
                            <button
                                className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 bg-white text-black px-4 py-2 transition-all duration-300 group-hover:translate-y-1/2 group-hover:opacity-100"
                            >
                                ADD TO CART
                            </button>
                            <p className="text-gray-500 mt-4">Dresses</p>
                            <p className="text-black font-bold">Cropped Faux Leather Jacket</p>
                            <p className="text-black">$29</p>
                            <div className="flex mt-2">
                                <i className="fas fa-star text-yellow-500"></i>
                                <i className="fas fa-star text-yellow-500"></i>
                                <i className="fas fa-star text-yellow-500"></i>
                                <i className="fas fa-star text-yellow-500"></i>
                                <i className="fas fa-star text-yellow-500"></i>
                                <p className="text-gray-500 ml-2">8k+ reviews</p>
                            </div>
                        </div>

                        <div className="relative group">
                            <img
                                alt="Woman wearing a cropped faux leather jacket"
                                className="w-full"
                                height="400"
                                src="https://placehold.co/400x485"
                                width="300"
                            />
                            <button
                                className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 bg-white text-black px-4 py-2 transition-all duration-300 group-hover:translate-y-1/2 group-hover:opacity-100"
                            >
                                ADD TO CART
                            </button>
                            <p className="text-gray-500 mt-4">Dresses</p>
                            <p className="text-black font-bold">Calvin Shorts</p>
                            <p className="text-black">$62</p>
                            
                          <div className="d-flex align-items-center mt-1"> 
                            <a className="swatch-color pc__swatch-color  swatch_active" style={{color: 'rgb(186, 186, 186)'}} />
                            <a className="swatch-color pc__swatch-color  " style={{color: 'rgb(215, 107, 103)'}} />
                            <a className="swatch-color pc__swatch-color  " style={{color: 'rgb(191, 220, 196)'}} /> 
                          </div>
                          <div className="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
                            <div className="pc-labels__right ms-auto">
                              <span className="pc-label pc-label_sale d-block text-white">-67%</span>
                            </div>
                          </div>

                        </div>

                        <div className="relative group">
                            <img
                                alt="Woman wearing a cropped faux leather jacket"
                                className="w-full"
                                height="400"
                                src="https://placehold.co/400x485"
                                width="300"
                            />
                            <button
                                className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 bg-white text-black px-4 py-2 transition-all duration-300 group-hover:translate-y-1/2 group-hover:opacity-100"
                            >
                                ADD TO CART
                            </button>
                            <p className="text-gray-500 mt-4">Dresses</p>
                            <p className="text-black font-bold">Kirby T-Shirt
                           </p>
                            <p className="text-black">$17</p>
                           
                        </div>

                        <div className="relative group">
                            <img
                                alt="Woman wearing a cropped faux leather jacket"
                                className="w-full"
                                height="400"
                                src="https://placehold.co/400x485"
                                width="300"
                            />
                            <button
                                className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 bg-white text-black px-4 py-2 transition-all duration-300 group-hover:translate-y-1/2 group-hover:opacity-100"
                            >
                                ADD TO CART
                            </button>
                            <p className="text-gray-500 mt-4">Dresses</p>
                            <p className="text-black font-bold">Cableknit Shawl</p>
                            <p className="text-black">$29</p>
                            <div className="product-card__price d-flex">
                                <span className="money price price-old">$129</span>
                                <span className="money price price-sale">$99</span>
                            </div>

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
