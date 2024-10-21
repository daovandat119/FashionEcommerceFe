import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useContextElement } from "../../context/Context";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";

const ProductDetail = () => {
  const { id } = useParams(); // Lấy product ID từ URL
  const [product, setProduct] = useState(null); // Lưu thông tin sản phẩm
  const [sizes, setSizes] = useState([]); // Lưu thông tin kích thước
  const [colors, setColors] = useState([]); // Lưu thông tin màu sắc
  const [quantity, setQuantity] = useState(1); // Lưu số lượng sản phẩm
  const [selectedSize, setSelectedSize] = useState(null); // Kích thước đã chọn
  const [selectedColor, setSelectedColor] = useState(null); // Màu sắc đã chọn

  // Lấy các hàm từ context
  const { addProductToCart, isAddedToCartProducts } = useContextElement();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. Redirecting to login...");
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    // Lấy dữ liệu sản phẩm từ API
    axios.get(`http://127.0.0.1:8000/api/products/${id}`, config)
      .then((response) => {
        setProduct(response.data.data); // Chỉ lấy phần dữ liệu từ API
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });

    // Lấy dữ liệu kích thước từ API
    axios.get("http://127.0.0.1:8000/api/sizes", config)
      .then((response) => {
        setSizes(response.data.data); // Lưu kích thước từ API
      })
      .catch((error) => {
        console.error("Error fetching sizes:", error);
      });

    // Lấy dữ liệu màu sắc từ API
    axios.get("http://127.0.0.1:8000/api/colors", config)
      .then((response) => {
        setColors(response.data.data); // Lưu màu sắc từ API
      })
      .catch((error) => {
        console.error("Error fetching colors:", error);
      });
  }, [id]);

  const increaseQuantity = () => {
    setQuantity((prevQty) => prevQty + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQty) => (prevQty > 1 ? prevQty - 1 : 1));
  };

  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      addProductToCart(product.ProductID, selectedColor.ColorID, selectedSize.SizeID, quantity);
      console.log('====================================');
      console.log(product.ProductID, selectedColor.ColorID, selectedSize.SizeID, quantity);
      console.log('====================================');
    } else {
      alert("Please select size and color before adding to cart.");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <section className="product-single container">
      <div className="row">
        {/* Hình ảnh sản phẩm */}
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

        {/* Thông tin sản phẩm */}
        <div className="col-lg-5">
          <h1 className="product-single__name">{product.ProductName}</h1>
          <div className="product-single__price">
            <span className="current-price">${product.Price}</span>
          </div>

          <div className="product-single__short-desc">
            <p>{product.Description}</p>
          </div>

          {/* Chọn kích thước và màu sắc */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="product-single__swatches">
              {/* Hiển thị kích thước */}
              <div className="product-swatch text-swatches">
                <label>Kích thước</label>
                <div className="swatch-list">
                  {sizes.map((size) => (
                    <React.Fragment key={size.SizeID}>
                      <input
                        type="radio"
                        name="size"
                        id={`size-${size.SizeID}`}
                        onChange={() => setSelectedSize(size)}
                      />
                      <label
                        className="swatch js-swatch"
                        htmlFor={`size-${size.SizeID}`}
                        aria-label={size.SizeName}
                      >
                        {size.SizeName}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Hiển thị màu sắc */}
              <div className="product-swatch color-swatches">
                <label>Màu sắc</label>
                <div className="swatch-list">
                  {colors.map((color) => (
                    <React.Fragment key={color.ColorID}>
                      <input
                        type="radio"
                        name="color"
                        id={`color-${color.ColorID}`}
                        onChange={() => setSelectedColor(color)}
                      />
                      <label
                        className="swatch swatch-color js-swatch"
                        htmlFor={`color-${color.ColorID}`}
                        style={{ backgroundColor: color.ColorName }}
                      ></label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Số lượng sản phẩm */}
            <div className="product-single__addtocart">
              <div className="qty-control position-relative">
                <input
                  type="number"
                  name="quantity"
                  value={quantity}
                  min="1"
                  className="qty-control__number text-center"
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <div className="qty-control__reduce" onClick={decreaseQuantity}>
                  -
                </div>
                <div className="qty-control__increase" onClick={increaseQuantity}>
                  +
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-addtocart"
                onClick={handleAddToCart}
              >
                {isAddedToCartProducts(product.ProductID) ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Thông tin bổ sung và đánh giá */}
      <AdditionalInfo product={product} />
      <Reviews productId={product.ProductID} />
    </section>
  );
};

export default ProductDetail;
