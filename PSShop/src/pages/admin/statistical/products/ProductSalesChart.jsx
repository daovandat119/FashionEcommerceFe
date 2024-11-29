import React, { useState, useEffect, useCallback } from "react";
import { GetProductVariantsStatistics } from "../../service/api_service";
import ReactPaginate from "react-paginate";
import { useDebounce } from "use-debounce";

const ProductSalesTable = ({ data, onSearch, onPageChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchValue] = useDebounce(searchTerm, 500);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false); // Trạng thái mới cho tính khả dụng

  useEffect(() => {
    setLoading(true);
    if (data && Array.isArray(data.data)) {
      const formattedProducts = data.data.map((product) => ({
        id: product.ProductID,
        name: product.ProductName,
        quantity: product.Quantity,
        totalSold: product.TotalSold,
        total: parseFloat(product.TotalRevenue),
      }));
      setProducts(formattedProducts);
      setTotalPage(data.total);
      setCurrentPage(data.page);
    }
    setLoading(false);
  }, [data]);

  const fetchProductVariantsStatistics = async (ProductID) => {
    const response = await GetProductVariantsStatistics(ProductID);
    if (response.data && Array.isArray(response.data)) {
      setProductVariants(response.data);
    }
  };

  const handlePageClick = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      onPageChange(newPage);
    },
    [onPageChange]
  );

  const handleSearch = useCallback((searchValue) => {
    onSearch(searchValue);
  }, []);

  const handleDetailsToggle = (product) => {
    setExpandedProduct(expandedProduct === product ? null : product);
    setIsDetailsVisible(expandedProduct !== product); // Chuyển đổi tính khả dụng
    fetchProductVariantsStatistics(product.id);
  };

  useEffect(() => {
    handleSearch(debouncedSearchValue);
  }, [debouncedSearchValue]);

  return (
    <div className="container mx-auto p-4 border-2 border-gray-300 rounded-lg bg-white h-[380px] overflow-hidden">
      <h2 className="text-xl font-bold mb-4">Thống kê sản phẩm bán ra</h2>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập tên sản phẩm"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
          </div>
          <div>
            <label className="mr-2">Hiển thị:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-y-auto h-[400px]">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border border-gray-300 p-2">Sản phẩm</th>
                <th className="border border-gray-300 p-2">Tồn kho</th>
                <th className="border border-gray-300 p-2">Đã bán</th>
                <th className="border border-gray-300 p-2">Tổng doanh thu</th>
                <th className="border border-gray-300 p-2">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <React.Fragment key={index}>
                  <tr className="hover:bg-gray-50 text-center">
                    <td className="border border-gray-300 p-2">
                      {product.name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {product.quantity}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {product.totalSold}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {product.total.toLocaleString()} VNĐ
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDetailsToggle(product)} // Cập nhật hàm xử lý
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                  {expandedProduct === product &&
                    isDetailsVisible && ( // Kiểm tra tính khả dụng
                      <tr>
                        <td colSpan="5" className="border border-gray-300 p-2">
                          <div className="max-h-40 overflow-y-auto transition-all duration-300 ease-in-out">
                            <p>
                              <strong>Tên sản phẩm:</strong> {product.name}
                            </p>
                            <table className="min-w-full border border-gray-300 text-center">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border border-gray-300 p-2">
                                    Size
                                  </th>
                                  <th className="border border-gray-300 p-2">
                                    Color
                                  </th>
                                  <th className="border border-gray-300 p-2">
                                    Tồn kho
                                  </th>
                                  <th className="border border-gray-300 p-2">
                                    Đã bán
                                  </th>
                                  <th className="border border-gray-300 p-2">
                                    Giá
                                  </th>
                                  <th className="border border-gray-300 p-2">
                                    Tổng doanh thu
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="overflow-hidden">
                                {productVariants.map((variant, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-2">
                                      {variant.Size}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                      {variant.Color}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                      {variant.StockQuantity}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                      {variant.TotalSold}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                      {parseFloat(
                                        variant.Price
                                      ).toLocaleString()}{" "}
                                      VNĐ
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                      {parseFloat(
                                        variant.TotalRevenue
                                      ).toLocaleString()}{" "}
                                      VNĐ
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {totalPage > 1 && (
            <ReactPaginate
              breakLabel="..."
              nextLabel=" >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={totalPage}
              previousLabel="<"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination flex justify-center space-x-2 mt-4"
              activeClassName="active bg-blue-500 text-white"
              forcePage={currentPage - 1}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSalesTable;
