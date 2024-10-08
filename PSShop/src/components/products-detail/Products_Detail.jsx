// src/components/Products_Detail.jsx

import { useState } from "react";
import { Tabs, Tab } from 'react-bootstrap'; // Import Tabs từ react-bootstrap
import ProductSlider1 from "./ProductSlider1";
import BreadCumb from "./BreadCumb";
import Star from "../common/Star";
import Colors from "./Colors";
import Size from "./Size";
import Description from "./Description";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";
// import { Link } from "react-router-dom";
import ShareComponent from "./ShareComponent";
import { useContextElement } from "../../context/Context";

export default function Products_Detail({ product }) {
  const { cartProducts, setCartProducts } = useContextElement();
  const [quantity, setQuantity] = useState(1);

  const isIncludeCard = () => {
    return cartProducts.find((elm) => elm.id === product.id);
  };

  const setQuantityCartItem = (id, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) return;

    const currentItem = isIncludeCard();

    if (currentItem) {
      const updatedCart = cartProducts.map((item) =>
        item.id === id ? { ...item, quantity: parsedQuantity } : item
      );
      setCartProducts(updatedCart);
    } else {
      setQuantity(parsedQuantity);
    }
  };

  const addToCart = () => {
    if (!isIncludeCard()) {
      const item = { ...product, quantity };
      setCartProducts((pre) => [...pre, item]);
    }
  };

  const currentItem = isIncludeCard();

  return (
    <section className="product-single container">
      <div className="row">
        <div className="col-lg-7">
          <ProductSlider1 />
        </div>
        <div className="col-lg-5">
          <div className="d-flex justify-content-between mb-4 pb-md-2">
            <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
              <BreadCumb />
            </div>
            {/* <!-- /.breadcrumb --> */}

            <div className="product-single__prev-next d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
              <a
                href="#"
                className="text-uppercase fw-medium"
                onClick={(e) => e.preventDefault()}
              >
                <svg
                  className="mb-1px"
                  width="10"
                  height="10"
                  viewBox="0 0 25 25"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_prev_md" />
                </svg>
                <span className="menu-link menu-link_us-s">Prev</span>
              </a>
              <a
                href="#"
                className="text-uppercase fw-medium"
                onClick={(e) => e.preventDefault()}
              >
                <span className="menu-link menu-link_us-s">Next</span>
                <svg
                  className="mb-1px"
                  width="10"
                  height="10"
                  viewBox="0 0 25 25"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_next_md" />
                </svg>
              </a>
            </div>
            {/* <!-- /.shop-acs --> */}
          </div>
          <h1 className="product-single__name">{product.title}</h1>
          <div className="product-single__rating">
            <div className="reviews-group d-flex">
              <Star stars={5} />
            </div>
            <span className="reviews-note text-lowercase text-secondary ms-1">
              8k+ reviews
            </span>
          </div>
          <div className="product-single__price">
            <span className="current-price">${product.price}</span>
          </div>
          <div className="product-single__short-desc">
            <p>
              Phasellus sed volutpat orci. Fusce eget lore mauris vehicula
              elementum gravida nec dui. Aenean aliquam varius ipsum, non
              ultricies tellus sodales eu. Donec dignissim viverra nunc, ut
              aliquet magna posuere eget.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="product-single__swatches">
              <div className="product-swatch text-swatches">
                <label>Sizes</label>
                <div className="swatch-list">
                  <Size />
                </div>
                <a
                  href="#"
                  className="sizeguide-link"
                  data-bs-toggle="modal"
                  data-bs-target="#sizeGuide"
                  onClick={(e) => e.preventDefault()}
                >
                  Size Guide
                </a>
              </div>
              <div className="product-swatch color-swatches">
                <label>Color</label>
                <div className="swatch-list">
                  <Colors />
                </div>
              </div>
            </div>
            <div className="product-single__addtocart">
              <div className="qty-control position-relative">
                <input
                  type="number"
                  name="quantity"
                  value={currentItem ? currentItem.quantity : quantity}
                  min="1"
                  onChange={(e) =>
                    setQuantityCartItem(product.id, e.target.value)
                  }
                  className="qty-control__number text-center"
                />
                <div
                  onClick={() =>
                    setQuantityCartItem(
                      product.id,
                      currentItem
                        ? currentItem.quantity - 1
                        : quantity - 1
                    )
                  }
                  className="qty-control__reduce"
                >
                  -
                </div>
                <div
                  onClick={() =>
                    setQuantityCartItem(
                      product.id,
                      currentItem
                        ? currentItem.quantity + 1
                        : quantity + 1
                    )
                  }
                  className="qty-control__increase"
                >
                  +
                </div>
              </div>
              {/* <!-- .qty-control --> */}
              <button
                type="button"
                className="btn btn-dark btn-addtocart js-open-aside"
                onClick={() => addToCart()}
                disabled={currentItem}
              >
                {currentItem ? "Already Added" : "Add to Cart"}
              </button>
            </div>
          </form>
          <div className="product-single__addtolinks">
            <a
              href="#"
              className="menu-link menu-link_us-s add-to-wishlist"
              onClick={(e) => {
                e.preventDefault();
                // Thêm logic thêm vào wishlist ở đây
              }}
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
              <span>Add to Wishlist</span>
            </a>
            <ShareComponent title={product.title} />
          </div>
          <div className="product-single__meta-info">
            <div className="meta-item">
              <label>SKU:</label>
              <span>N/A</span>
            </div>
            <div className="meta-item">
              <label>Categories:</label>
              <span>Casual & Urban Wear, Jackets, Men</span>
            </div>
            <div className="meta-item">
              <label>Tags:</label>
              <span>biker, black, bomber, leather</span>
            </div>
          </div>
        </div>
      </div>
      <div className="product-single__details-tab">
        {/* Sử dụng Tabs từ react-bootstrap */}
        <Tabs defaultActiveKey="description" id="product-details-tabs" className="mb-3">
          <Tab eventKey="description" title="Description">
            <Description />
          </Tab>
          <Tab eventKey="additional-info" title="Additional Information">
            <AdditionalInfo />
          </Tab>
          <Tab eventKey="reviews" title="Reviews (2)">
            <Reviews />
          </Tab>
        </Tabs>
      </div>
    </section>
  );
}
