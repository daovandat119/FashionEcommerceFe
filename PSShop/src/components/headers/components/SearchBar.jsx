import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Hàm kiểm tra truy vấn có nằm trong tên sản phẩm hay không
const containsQuery = (productName, query) => {
  const normalizedProductName = productName.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  return normalizedProductName.includes(normalizedQuery);
};

// Hàm làm nổi bật văn bản khớp trong tên sản phẩm
const highlightText = (text, query) => {
  const normalizedQuery = query.toLowerCase();
  const parts = text.split(new RegExp(`(${normalizedQuery})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === normalizedQuery ? (
      <strong key={index} className="text-blue-600">
        {part}
      </strong>
    ) : (
      part
    )
  );
};

const SearchBar = () => {
  const [query, setQuery] = useState(""); // Trạng thái của truy vấn tìm kiếm
  const [searchResults, setSearchResults] = useState([]);

  // Hàm xử lý tìm kiếm sản phẩm
  const handleSearch = async () => {
    if (query) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/products/index`, {
            Search: query
          }
        );
        const filteredResults = response.data.data.filter((product) =>
          containsQuery(product.ProductName, query)
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Lỗi khi lấy kết quả tìm kiếm:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Hàm xử lý thay đổi trong input tìm kiếm
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch();
  };

  return (
    <div className="relative flex items-center">
      {/* Thanh tìm kiếm */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={query}
          onChange={handleInputChange}
          className="search-input w-72 p-2 border border-gray-300 rounded"
        />
      </form>
      {/* Hiển thị kết quả tìm kiếm ngay bên dưới */}
      {searchResults.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <ul className="max-h-60 overflow-y-auto">
            {searchResults.map((product) => (
              <li
                key={product.id}
                className="p-4 border-b last:border-b-0 flex items-center"
              >
                <Link
                  to={`/shop-detail/${product.ProductID}`}
                  className="flex items-center w-full"
                >
                  {/* Hiển thị hình ảnh sản phẩm */}
                  <img
                    src={product.MainImageURL}
                    alt={product.ProductName}
                    className="w-16 h-16 object-cover mr-4 rounded-md"
                  />
                  <div>
                    {/* Hiển thị tên sản phẩm với phần văn bản được làm nổi bật */}
                    <span>{highlightText(product.ProductName, query)}</span>
                    <p className="text-gray-600">Giá: {product.Price} VND</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hiển thị thông báo nếu không tìm thấy kết quả */}
      {searchResults.length === 0 && query && (
        <p className="text-gray-500 absolute top-full mt-2">
          Không tìm thấy sản phẩm nào trùng khớp.
        </p>
      )}
    </div>
  );
};

export default SearchBar;
