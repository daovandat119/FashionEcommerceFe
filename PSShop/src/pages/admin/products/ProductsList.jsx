import { useEffect, useState } from "react";
import { Input, Checkbox, Avatar } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ToggleSwitch from "../components/ToggleSwitch";
import { Link, useLocation } from "react-router-dom";
import {
  ListProducts,
  DeleteProducts,
  ListCategories,
  GetProductById, // Thêm dòng này
} from "../service/api_service";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductsList = () => {
  const [listProducts, setListProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    getProducts(1);
    getCategories();

    // Kiểm tra và hiển thị thông báo thành công nếu có
    if (location.state?.success) {
      toast.success(location.state.message);
      // Xóa state để tránh hiển thị lại khi refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const getProducts = async (page) => {
    try {
      let res = await ListProducts(page);
      if (res && res.data) {
        console.log(res);
        setTotalProducts(res.total);
        setListProducts(res.data);
        setTotalPages(res.totalPage);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    }
  };

  const getCategories = async () => {
    try {
      let res = await ListCategories(1, 1000); // Lấy tất cả danh mục
      if (res && res.data) {
        const categoryMap = {};
        res.data.forEach((category) => {
          categoryMap[category.CategoryID] = category.CategoryName;
        });
        setCategories(categoryMap);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
    }
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    getProducts(newPage);
  };

  const handleSelectProduct = (ProductID) => {
    setSelectedProducts((prev) =>
      prev.includes(ProductID)
        ? prev.filter((id) => id !== ProductID)
        : [...prev, ProductID]
    );
  };

  const handleDeleteProducts = async () => {
    if (selectedProducts.length === 0) {
      toast.warn("Vui lòng chọn ít nhất một sản phẩm để xóa");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?")) {
      try {
        const response = await DeleteProducts(selectedProducts);
        console.log("API Response:", response);

        // Kiểm tra nếu response.data tồn tại và có thuộc tính success
        if (response.data && response.data.success === true) {
          toast.success(response.data.message || "Xóa sản phẩm thành công");
          getProducts(currentPage); // Tải lại danh sách
          setSelectedProducts([]); // Reset danh sách đã chọn
        } else if (response.status === 200) {
          // Trờng hợp status là 200 nhưng không có success: true
          toast.success("Xóa sản phẩm thành công");
          getProducts(currentPage);
          setSelectedProducts([]);
        } else {
          // Trường hợp khác
          throw new Error(
            response.data?.message || "Có lỗi xảy ra khi xóa sản phẩm"
          );
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        if (error.response) {
          console.log("Error response:", error.response);
          if (error.response.status === 404) {
            toast.error("Sản phẩm không tồn tại hoặc đã bị xóa");
          } else {
            toast.error(
              "Xóa sản phẩm thất bại: " +
                (error.response.data?.message || "Có lỗi xảy ra")
            );
          }
        } else if (error.request) {
          toast.error("Không nhận được phản hồi từ server");
        } else {
          toast.error("Lỗi: " + error.message);
        }
      } finally {
        // Luôn tải lại danh sách sản phẩm, bất kể thành công hay thất bại
        getProducts(currentPage);
      }
    }
  };

  const handleViewProductDetails = async (ProductID) => {
    try {
      const response = await GetProductById(ProductID);
      if (response && response.data) {
        console.log("Product details:", response.data);
        // Ở đây bạn có thể xử lý dữ liệu chi tiết sản phẩm
        // Ví dụ: hiển thị trong một modal hoặc chuyển hướng đến trang chi tiết
        toast.success("Đã lấy chi tiết sản phẩm thành công");
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      toast.error("Không thể lấy chi tiết sản phẩm");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Quản lý Sản phẩm</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Tìm kiếm sản phẩm"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
          />
        </div>
        <Link
          to="/admin/products/add"
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5" /> Thêm Sản phẩm
        </Link>
        <button
          onClick={handleDeleteProducts}
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
        >
          <TrashIcon className="h-5 w-5" /> Xóa đã chọn
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-max border-collapse">
          <thead className="bg-white">
            <tr>
              <th className="border-b p-4 w-1 text-left">Select</th>
              <th className="border-b p-4 text-left">Name </th>
              <th className="border-b p-4 text-left">Category</th>
              <th className="border-b p-4 text-left">Price</th>
              <th className="border-b p-4 text-left">Sale Price</th>
              <th className="border-b p-4 text-left">Active</th>
              <th className="border-b p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listProducts.map((item, index) => (
              <tr key={`product-${index}`} className="hover:bg-gray-50">
                <td className="border-b p-1 text-center">
                  <Checkbox
                    checked={selectedProducts.includes(item.ProductID)}
                    onChange={() => handleSelectProduct(item.ProductID)}
                    className="border-2 border-gray-400"
                  />
                </td>
                <td className="border-b p-4 flex items-center">
                  {item.MainImageURL ? (
                    <img
                      src={item.MainImageURL}
                      alt={item.ProductName}
                      className="w-14 h-14 object-cover mr-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/path/to/fallback/image.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}

                  <span>{item.ProductName}</span>
                </td>
                <td className="border-b p-4">
                  {categories[item.CategoryID] || "N/A"}
                </td>
                <td className="border-b p-4">{item.Price}</td>
                <td className="border-b p-4">{item.SalePrice}</td>
                <td className="border-b p-4">
                  <ToggleSwitch />
                </td>
                <td className="border-b p-4">
                  <Link
                    to={`/admin/products/edit/${item.ProductID}`}
                    className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteProducts([item.ProductID])}
                    className="bg-red-500 text-white p-2 rounded-full mr-2 hover:bg-red-600 transition-colors inline-flex items-center justify-center"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <ReactPaginate
            breakLabel="..."
            nextLabel=" >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPages}
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
    </div>
  );
};

export default ProductsList;
