import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from "rc-slider";

// eslint-disable-next-line react/prop-types
export default function FilterAll({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  // State cho các filter đã chọn
  const [selectedFilters, setSelectedFilters] = useState({
    categoryId: null,
    colorId: null,
    sizeId: null,
    minPrice: 0,
    maxPrice: 100000,
  });

  const hasFetchedData = useRef(false); // Thêm useRef để theo dõi việc đã gọi API

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetchedData.current) return; // Ngăn không gọi lại nếu đã gọi
  
      setLoading(true);
      try {
        const [categoriesRes, colorsRes, sizesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/categories"),
          axios.get("http://127.0.0.1:8000/api/colors"),
          axios.get("http://127.0.0.1:8000/api/sizes"),
        ]);
  
        setCategories(categoriesRes.data.data);
        setColors(colorsRes.data.data); 
        setSizes(sizesRes.data.data);
        hasFetchedData.current = true; // Đánh dấu là đã gọi API
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
  
    fetchData();
  }, []); 

  // Xử lý khi filter thay đổi
  const handleFilterChange = (type, value) => {
    const newFilters = {
      ...selectedFilters,
      [type]: value,
    };

    console.log(newFilters);
    setSelectedFilters(newFilters);
    onFilterChange(newFilters); // Gửi filters lên component cha
  };

  // Xử lý thay đổi giá
  const handlePriceChange = (value) => {
    setPriceRange(value);
    handleFilterChange("minPrice", value[0]);
    handleFilterChange("maxPrice", value[1]);
  };

  return (
    <>
      {/* Categories */}
      <div className="accordion" id="categories-list">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header text-lg font-semibold font-sans text-gray-900" id="accordion-heading-11">
            Danh mục sản phẩm
          </h5>
          <div className="accordion-body px-0 pb-0">
            <ul className="list list-inline row row-cols-2 mb-0">
              {categories.map((category) => (
                <li key={category.CategoryID} className="list-item">
                  <a
                    href="#"
                    className={`menu-link py-1 text-base font-medium font-sans text-gray-700 hover:text-blue-600 ${
                      selectedFilters.categoryId === category.CategoryID ? "font-bold" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleFilterChange("categoryId", category.CategoryID);
                    }}
                  >
                    {category.CategoryName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="accordion" id="color-filters">
        <h5 className="accordion-header font-semibold text-lg font-sans text-gray-900 mb-3" id="accordion-heading-1">
          Lựa chọn màu sắc
        </h5>
        <div className="accordion-body px-0 pb-0">
          <div className="d-flex flex-wrap gap-2">
            {colors.map((color) => (
              <div key={color.ColorID} className="color-item position-relative">
                <a
                  className={`swatch-color d-inline-block rounded-circle shadow-sm font-sans ${
                    selectedFilters.colorId === color.ColorID ? "scale-110 border-2 border-gray-500" : "border-2 border-transparent"
                  }`}
                  onClick={() => handleFilterChange("colorId", color.ColorID)}
                  style={{
                    backgroundColor: color.ColorName.toLowerCase(),
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  title={color.ColorName}
                >
                  {color.ColorName.toLowerCase() === "black" && (
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "60%",
                        height: "60%",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        opacity: 0.2,
                      }}
                    />
                  )}
                </a>
                {selectedFilters.colorId === color.ColorID && (
                  <span
                    className="position-absolute"
                    style={{
                      top: "-5px",
                      right: "-5px",
                      width: "15px",
                      height: "15px",
                      backgroundColor: "#28a745",
                      borderRadius: "50%",
                      border: "2px solid white",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="accordion" id="size-filters">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header text-lg font-semibold font-sans text-gray-900" id="accordion-heading-size">
            Kích thước
          </h5>
          <div className="accordion-body px-0 pb-0">
            <div className="d-flex flex-wrap">
              {sizes.map((size) => (
                <a
                  key={size.SizeID}
                  className={`swatch-size btn btn-sm btn-outline-light mb-3 me-3 text-base font-medium font-sans text-gray-700 hover:text-blue-600 ${
                    selectedFilters.sizeId === size.SizeID ? "font-bold" : ""
                  }`}
                  onClick={() => handleFilterChange("sizeId", size.SizeID)}
                >
                  {size.SizeName}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="accordion" id="price-filters">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header text-lg font-semibold font-sans text-gray-900 mb-2" id="accordion-heading-price">
            Giá
          </h5>
          <Slider
            range
            min={0}
            max={100000}
            value={priceRange}
            onChange={handlePriceChange}
            className="mb-3"
          />
          <div className="price-range__info d-flex align-items-center mt-2 text-sm text-gray-700 font-sans">
            <div className="me-auto">
              <span className="text-secondary">Min Price: </span>
              <span className="price-range__min">${priceRange[0]}</span>
            </div>
            <div>
              <span className="text-secondary">Max Price: </span>
              <span className="price-range__max">${priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <div className="filter-active-tags pt-2">
        {Object.entries(selectedFilters).map(([key, value]) => {
          if (value) {
            let label = "";
            if (key === "categoryId") {
              label = categories.find(
                (c) => c.CategoryID === value
              )?.CategoryName;
            } else if (key === "colorId") {
              label = colors.find((c) => c.ColorID === value)?.ColorName;
            } else if (key === "sizeId") {
              label = sizes.find((s) => s.SizeID === value)?.SizeName;
            }

            if (label) {
              return (
                <button
                  key={key}
                  className="filter-tag d-inline-flex align-items-center mb-3 me-3 text-sm font-medium text-gray-700 hover:text-blue-600 font-sans"
                  onClick={() => handleFilterChange(key, null)}
                >
                  <i className="btn-close-xs d-inline-block" />
                  <span className="ms-2">{label}</span>
                </button>
              );
            }
          }
          return null;
        })}
      </div>
    </>
  );
}
