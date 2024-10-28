import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useContextElement } from "../../context/Context";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";
import Swal from 'sweetalert2'

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [variantInfo, setVariantInfo] = useState(null);

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

  const checkProductVariant = async () => {
    if (!selectedSize || !selectedColor) return null;

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/getVariantByID',
        {
          ProductID: product.ProductID,
          SizeID: selectedSize.SizeID,
          ColorID: selectedColor.ColorID
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi kiểm tra biến thể:", error);
      return null;
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Thêm dòng này
    
    if (!selectedSize || !selectedColor) {
      Swal.fire({
        title: "Thông báo",
        text: "Vui lòng chọn kích thước và màu sắc",
        icon: "warning"
      });
      return;
    }

    setIsChecking(true);
    try {
      const variant = await checkProductVariant();
      
      if (!variant) {
        Swal.fire({
          title: "Hết hàng",
          text: "Rất tiếc, sản phẩm này tạm hết hàng với màu sắc và kích thước đã chọn",
          icon: "warning"
        });
        return;
      }

      if (variant.Quantity < quantity) {
        Swal.fire({
          title: "Số lượng không đủ",
          text: `Chỉ còn ${variant.Quantity} sản phẩm trong kho`,
          icon: "warning"
        });
        return;
      }

      await addProductToCart(
        product.ProductID,
        selectedColor.ColorID,
        selectedSize.SizeID,
        quantity
      );

      await Swal.fire({
        title: "Thành công",
        text: "Đã thêm sản phẩm vào giỏ hàng",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      });

    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Đã có lỗi xảy ra, vui lòng thử lại sau",
        icon: "error"
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Thêm useEffect để kiểm tra biến thể khi chọn size và color
  useEffect(() => {
    const checkVariant = async () => {
      if (selectedSize && selectedColor && product) {
        const variant = await checkProductVariant();
        setVariantInfo(variant);
      }
    };
    checkVariant();
  }, [selectedSize, selectedColor]);

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
          <form onSubmit={handleAddToCart}>
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
                        className={`swatch js-swatch ${selectedSize?.SizeID === size.SizeID ? 'active' : ''}`}
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
                        className={`swatch swatch-color js-swatch ${selectedColor?.ColorID === color.ColorID ? 'active' : ''}`}
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
                <div 
                  className="qty-control__reduce" 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </div>
                <div 
                  className="qty-control__increase" 
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </div>
              </div>

              {/* Hiển thị thông tin tồn kho */}
              {variantInfo && (
                <div className="stock-info mt-2 mb-2">
                  <span className={`stock-status ${variantInfo.Quantity > 0 ? 'text-success' : 'text-danger'}`}>
                    {variantInfo.Quantity > 0 
                      ? `Còn ${variantInfo.Quantity} sản phẩm trong kho` 
                      : 'Hết hàng'}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-addtocart"
                disabled={isChecking || (variantInfo && variantInfo.Quantity === 0)}
              >
                {isChecking ? (
                  "Đang kiểm tra..."
                ) : variantInfo && variantInfo.Quantity === 0 ? (
                  "Hết hàng"
                ) : (
                  // Thêm kiểm tra isAddedToCartProducts
                  typeof isAddedToCartProducts === 'function' && isAddedToCartProducts(product.ProductID) ? (
                    "Đã thêm vào giỏ"
                  ) : (
                    "Thêm vào giỏ"
                  )
                )}
              </button>
            </div>
          </form>
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
            {/* <Description /> */}
          </div>
          <div
            className="tab-pane fade"
            id="tab-additional-info"
            role="tabpanel"
            aria-labelledby="tab-additional-info-tab"
          >
          <AdditionalInfo product={product} />
          </div>
          <div
            className="tab-pane fade"
            id="tab-reviews"
            role="tabpanel"
            aria-labelledby="tab-reviews-tab"
          >
             <Reviews productId={product.ProductID} />
          </div>
        </div>
      </div>
      {/* Thông tin bổ sung và đánh giá */}
      
     
    </section>
  );
};

export default ProductDetail;
