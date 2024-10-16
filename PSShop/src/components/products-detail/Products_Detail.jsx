/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BreadCumb from "./BreadCumb";
import Star from "../common/Star";
import Colors from "./Colors";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";
import ShareComponent from "./ShareComponent";
import { useContextElement } from "../../context/Context";

export default function Products_Detail() {
  const { id } = useParams();

  const { cartProducts, setCartProducts } = useContextElement();
  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selectedSize] = useState(null); //setSelectedSize
  const [quantity, setQuantity] = useState(1);
  const [productError, setProductError] = useState(null);
  const [sizesError, setSizesError] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [sizesLoading, setSizesLoading] = useState(true);

  useEffect(() => {
    // Fetch product details by ID
    setProductLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}`)
      .then((response) => {
        setProduct(response.data.data || response.data);
        setProductLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details", error);
        setProductError("Unable to load product details.");
        setProductLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (id) {
      // Fetch sizes by product ID
      setSizesLoading(true);
      axios
        .get(`http://127.0.0.1:8000/api/sizes`, { params: { product_id: id } })
        .then((response) => {
          setSizes(response.data.data || response.data);
          setSizesLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching sizes", error);
          setSizesError("Unable to load sizes.");
          setSizesLoading(false);
        });
    }
  }, [id]);

  const isIncludeCart = () => {
    return cartProducts.find((elm) => elm.id === product.ProductID);
  };

  const setQuantityCartItem = (id, qty) => {
    if (isIncludeCart()) {
      if (qty >= 1) {
        const updatedCart = cartProducts.map((item) =>
          item.id === id ? { ...item, quantity: qty } : item
        );
        setCartProducts(updatedCart);
      }
    } else {
      setQuantity(qty >= 1 ? qty : 1);
    }
  };

  const addToCart = () => {
    if (!isIncludeCart() && product) {
      const item = {
        id: product.ProductID,
        ProductName: product.ProductName,
        Price: product.Price,
        Description: product.Description,
        images: product.images,
        quantity,
        size: selectedSize, // Thêm kích thước vào đối tượng sản phẩm
      };
      setCartProducts((prev) => [...prev, item]);
    }
  };

  if (productLoading || sizesLoading) {
    return <p>Loading product details...</p>;
  }

  if (productError) {
    return <p>{productError}</p>;
  }

  if (sizesError) {
    return <p>{sizesError}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <section className="product-single container">
      <div className="row">
        <div className="col-lg-7">
          <div className="product-single__media vertical-thumbnail product-media-initialized">
            <div className="product-single__image position-relative">
              <img
                src={product.MainImageURL}
                alt={product.ProductName}
                className="h-auto w-100"
                width="674"
                height="674"
              />
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="d-flex justify-content-between mb-4 pb-md-2">
            <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
              <BreadCumb />
            </div>
            <div className="product-single__prev-next d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
              {/* Implement previous and next navigation if needed */}
            </div>
          </div>
          <h1 className="product-single__name">{product.ProductName}</h1>
          <div className="product-single__rating">
            <div className="reviews-group d-flex">
              <Star stars={5} />
            </div>
            <span className="reviews-note text-lowercase text-secondary ms-1">
              8k+ reviews
            </span>
          </div>
          <div className="product-single__price">
            <span className="current-price">{product.Price} VND</span>
          </div>
          <div className="product-single__short-desc">
            <p>{product.Description}</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="product-single__swatches">
              <div className="product-swatch text-swatches">
                <label>Sizes</label>
                <div className="swatch-list">
                  {sizes && sizes.length > 0 ? (
                    sizes.map((size) => (
                      <React.Fragment key={size.id}>
                        <input
                          type="radio"
                          name="size"
                          id={`swatch-${size.id}`}
                          value={size.SizeName}
                          defaultChecked={size.isDefault}
                          // onChange={() => handleSizeChange(size.value)}
                        />
                        <label
                          className="swatch js-swatch"
                          htmlFor={`swatch-${size.id}`}
                          aria-label={size.SizeName}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-tippy-content={size.SizeName}
                        >
                          {size.SizeName}
                        </label>
                      </React.Fragment>
                    ))
                  ) : (
                    <p>No sizes available.</p>
                  )}
                </div>
                <a
                  href="#"
                  className="sizeguide-link"
                  data-bs-toggle="modal"
                  data-bs-target="#sizeGuide"
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
                  value={isIncludeCart() ? isIncludeCart().quantity : quantity}
                  min="1"
                  onChange={(e) =>
                    setQuantityCartItem(
                      product.ProductID,
                      parseInt(e.target.value, 10)
                    )
                  }
                  className="qty-control__number text-center"
                />
                <div
                  onClick={() =>
                    setQuantityCartItem(
                      product.ProductID,
                      (isIncludeCart()?.quantity || quantity) - 1
                    )
                  }
                  className="qty-control__reduce"
                >
                  -
                </div>
                <div
                  onClick={() =>
                    setQuantityCartItem(
                      product.ProductID,
                      (isIncludeCart()?.quantity || quantity) + 1
                    )
                  }
                  className="qty-control__increase"
                >
                  +
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-addtocart js-open-aside"
                onClick={addToCart}
              >
                {isIncludeCart() ? "Already Added" : "Add to Cart"}
              </button>
            </div>
          </form>
          <div className="product-single__addtolinks">
            <a href="#" className="menu-link menu-link_us-s add-to-wishlist">
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
            <ShareComponent title={product.ProductName} />
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
        <ul className="nav nav-tabs" id="myTab1" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              className="nav-link nav-link_underscore active"
              id="tab-description-tab"
              data-bs-toggle="tab"
              href="#tab-description"
              role="tab"
              aria-controls="tab-description"
              aria-selected="true"
            >
              Description
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className="nav-link nav-link_underscore"
              id="tab-additional-info-tab"
              data-bs-toggle="tab"
              href="#tab-additional-info"
              role="tab"
              aria-controls="tab-additional-info"
              aria-selected="false"
            >
              Additional Information
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className="nav-link nav-link_underscore"
              id="tab-reviews-tab"
              data-bs-toggle="tab"
              href="#tab-reviews"
              role="tab"
              aria-controls="tab-reviews"
              aria-selected="false"
            >
              Reviews (2)
            </a>
          </li>
        </ul>
        <div className="tab-content">
          <div
            className="tab-pane fade show active"
            id="tab-description"
            role="tabpanel"
            aria-labelledby="tab-description-tab"
          >
            <div className="product-single__description">
              <h3 className="block-title mb-4">{product.ShortDescription}</h3>
              <p className="content">{product.Description}</p>
              <div className="row">
                <div className="col-lg-6">
                  <h3 className="block-title">Why choose product?</h3>
                  <ul className="list text-list">
                    <li>Created by cotton fabric with soft and smooth</li>
                    <li>
                      Simple, Configurable (e.g. size, color, etc.), bundled
                    </li>
                    <li>Downloadable/Digital Products, Virtual Products</li>
                  </ul>
                </div>
                <div className="col-lg-6">
                  <h3 className="block-title">Sample Number List</h3>
                  <ol className="list text-list">
                    <li>Create Store-specific attributes on the fly</li>
                    <li>
                      Simple, Configurable (e.g. size, color, etc.), bundled
                    </li>
                    <li>Downloadable/Digital Products, Virtual Products</li>
                  </ol>
                </div>
              </div>
              <h3 className="block-title mb-0">Lining</h3>
              <p className="content">100% Polyester, Main: 100% Polyester.</p>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="tab-additional-info"
            role="tabpanel"
            aria-labelledby="tab-additional-info-tab"
          >
            <AdditionalInfo />
          </div>
          <div
            className="tab-pane fade"
            id="tab-reviews"
            role="tabpanel"
            aria-labelledby="tab-reviews-tab"
          >
            <Reviews />
          </div>
        </div>
      </div>
    </section>
  );
}
