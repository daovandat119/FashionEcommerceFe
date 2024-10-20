import { useEffect, useState } from "react";
import { Input, Checkbox } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ToggleSwitch from "../components/ToggleSwitch";
import { Link, useLocation } from "react-router-dom";
import {
  ListProducts,
  DeleteProducts,
  ListCategories,
  UpdateProductStatus,
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
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state cho từ khóa tìm kiếm
  const location = useLocation();

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setListProducts(JSON.parse(storedProducts));
    } else {
      getProducts(1);
    }
    getCategories();

    // Kiểm tra và hiển thị thông báo thành công nếu có
    if (location.state?.success) {
      toast.success(location.state.message);
      getProducts(currentPage); // Gọi lại API để lấy danh sách sản phẩm mới
    }
  }, [location]);

  const getProducts = (page, search = "") => {
    ListProducts(page, search)
      .then(res => {
        if (res) {
          setTotalProducts(res.total);
          const updatedProducts = res.data.map(item => ({ ...item, isActive: item.Status === "ACTIVE" }));
          setListProducts(updatedProducts);
          setTotalPages(res.totalPage);
          setCurrentPage(page);
          localStorage.setItem('products', JSON.stringify(updatedProducts));
        }
      })
      .catch(error => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        toast.error("Không thể tải danh sách sản phẩm");
      });
  };

  const getCategories = async () => {
    try {
      let res = await ListCategories(1, "");
      if (res && res.data) {
        const categoryMap = {};
        res.data.forEach((category) => {
          categoryMap[category.CategoryID] = category.CategoryName;
        });
        setCategories(categoryMap);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
      toast.error("Không thể tải danh sách danh mục");
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

  const handleDeleteProduct = async (ProductID) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const response = await DeleteProducts(ProductID);
        if (response.success) {
          const updatedProducts = listProducts.filter(product => product.ProductID !== ProductID);
          setListProducts(updatedProducts);
          toast.success("Sản phẩm đã được xóa thành công");
          localStorage.setItem('products', JSON.stringify(updatedProducts));
        } else {
          toast.error("Xóa sản phẩm thất bại");
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        toast.error("Đã xảy ra lỗi khi xóa sản phẩm");
      }
    }
  };

  const handleToggleActive = async (item) => {
    const newStatus = item.isActive ? "INACTIVE" : "ACTIVE";
    try {
      const response = await UpdateProductStatus(item.ProductID, { Status: newStatus });
      if (response.success) {
        const updatedProducts = listProducts.map(product =>
          product.ProductID === item.ProductID
            ? { ...product, isActive: !product.isActive }
            : product
        );
        setListProducts(updatedProducts);
        toast.success("Cập nhật trạng thái sản phẩm thành công");
        localStorage.setItem('products', JSON.stringify(updatedProducts));
      } else {
        toast.error("Cập nhật trạng thái sản phẩm thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái sản phẩm");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Products Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2 bg-white rounded-lg shadow">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search Product"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              getProducts(1, e.target.value); // Gọi hàm với từ khóa tìm kiếm
            }}
          />
        </div>
        <Link
          to="/admin/products/add"
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5" /> New Product
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-max border-collapse">
          <thead className="bg-white">
            <tr>
              <th className="border-b p-4 w-1 text-left">Select</th>
              <th className="border-b p-4 text-left">Name</th>
              <th className="border-b p-4 text-left">Category</th>
              <th className="border-b p-4 text-left">Price</th>
              <th className="border-b p-4 text-left">Sale Price</th>
              <th className="border-b p-4 text-left">Active</th>
              <th className="border-b p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listProducts.map((item) => (
              <tr key={item.ProductID} className="hover:bg-gray-50">
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
                  <ToggleSwitch
                    isOn={item.isActive}
                    handleToggle={() => handleToggleActive(item)}
                  />
                </td>
                <td className="border-b p-4">
                  <Link
                    to={`/admin/products/edit/${item.ProductID}`}
                    className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(item.ProductID)}
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
