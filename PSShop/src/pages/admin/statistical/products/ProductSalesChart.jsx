import React, { useState, useEffect } from "react";
import {
  GetProductStatistics,
  GetProductVariantsStatistics,
} from "../../service/api_service";

const ProductSalesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [productVariants, setProductVariants] = useState([]);

  const fetchProductStatistics = async () => {
    setLoading(true);
    const response = await GetProductStatistics();
    if (response.data && Array.isArray(response.data)) {
      const formattedProducts = response.data.map((product) => ({
        id: product.ProductID,
        name: product.ProductName,
        quantity: product.Quantity,
        totalSold: product.TotalSold,
        total: parseFloat(product.TotalRevenue),
      }));
      setProducts(formattedProducts);
    } else {
      console.error("No product data found or data is not in expected format.");
    }
    setLoading(false);
  };

  const fetchProductVariantsStatistics = async (ProductID) => {
    const response = await GetProductVariantsStatistics(ProductID);
    if (response.data && Array.isArray(response.data)) {
      setProductVariants(response.data);
    } else {
      console.error("No product data found or data is not in expected format.");
    }
  };

  useEffect(() => {
    fetchProductStatistics();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 border-2 border-gray-300 rounded-lg bg-white h-[380px]">
      <h2 className="text-xl font-bold mb-4">Thống kê sản phẩm bán ra</h2>

      <div className="flex items-center justify-between">
      <label className="mr-2 text-base font-bold">Bộ lọc</label>
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
      <div className="flex justify-between mb-4">
        
        <div className="flex items-center gap-2">
         
          <input
            type="text"
            placeholder="Nhập tên sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />

<input
            type="text"
            placeholder="Nhập mã sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
   
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
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
            {filteredProducts.slice(0, itemsPerPage).map((product, index) => (
              <React.Fragment key={index}>
                <tr className="hover:bg-gray-50 text-center">
                  <td className="border border-gray-300 p-2">{product.name}</td>
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
                      onClick={() => {
                        setExpandedProduct(
                          expandedProduct === product ? null : product
                        );
                        fetchProductVariantsStatistics(product.id);
                      }}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
                {expandedProduct === product && (
                  <tr>
                    <td colSpan="5" className="border border-gray-300 p-2">
                      <div>
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
                          <tbody>
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
                                  {parseFloat(variant.Price).toLocaleString()}{" "}
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
      )}
    </div>
  );
};

export default ProductSalesTable;
