import { useEffect, useState, useCallback } from "react";
import { Input, Checkbox } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import ToggleSwitch from "../components/ToggleSwitch";
import { Link, useLocation } from "react-router-dom";
import {
  ListProducts,
  DeleteProducts,
  UpdateProductStatus,
} from "../service/api_service";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

const ProductsList = () => {
  const [listProducts, setListProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const getProducts = useCallback(async (page, search = "") => {
    setIsLoading(true);
    try {
      const res = await ListProducts(page, search);
      if (res) {
        setTotalProducts(res.total);
        const updatedProducts = res.data.map((item) => ({
          ...item,
          isActive: item.Status === "ACTIVE",
        }));
        setListProducts(updatedProducts);
        setTotalPages(res.totalPage);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hàm tìm kiếm
  const handleSearch = () => {
    getProducts(currentPage, searchTerm);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    getProducts(currentPage, searchTerm);
  }, [currentPage, searchTerm, getProducts]);

  const handlePageClick = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      setCurrentPage(newPage);
      getProducts(newPage, searchTerm);
    },
    [searchTerm, getProducts]
  );

  const handleSelectProduct = useCallback((ProductID) => {
    setSelectedProducts((prev) =>
      prev.includes(ProductID)
        ? prev.filter((id) => id !== ProductID)
        : [...prev, ProductID]
    );
  }, []);

  const handleDeleteProduct = useCallback((ProductID) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      DeleteProducts(ProductID)
        .then((response) => {
          if (response.success) {
            setListProducts((prevList) =>
              prevList.filter((product) => product.ProductID !== ProductID)
            );
            toast.success("Sản phẩm đã được xóa thành công");
          } else {
            toast.error("Xóa sản phẩm thất bại");
          }
        })
        .catch((error) => {
          console.error("Lỗi khi xóa sản phẩm:", error);
          toast.error("Đã xảy ra lỗi khi xóa sản phẩm");
        });
    }
  }, []);

  const handleToggleActive = useCallback(
    (item) => {
      const newStatus = item.Status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      UpdateProductStatus(item.ProductID, { Status: newStatus })
        .then((response) => {
          if (response.success) {
            const updatedProducts = listProducts.map((product) =>
              product.ProductID === item.ProductID
                ? { ...product, Status: newStatus }
                : product
            );
            setListProducts(updatedProducts);
            toast.success("Cập nhật trạng thái sản phẩm thành công");
          } else {
            toast.error("Cập nhật trạng thái sản phẩm thất bại");
          }
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
          toast.error("Đã xảy ra lỗi khi cập nhật trạng thái sản phẩm");
        });
    },
    [listProducts]
  );

  const handleDeleteSelected = useCallback(() => {
    if (window.confirm("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?")) {
      Promise.all(
        selectedProducts.map((ProductID) => DeleteProducts(ProductID))
      )
        .then((responses) => {
          const successfulDeletes = responses.filter(
            (response) => response.success
          );
          if (successfulDeletes.length > 0) {
            setListProducts((prevList) =>
              prevList.filter(
                (product) => !selectedProducts.includes(product.ProductID)
              )
            );
            setSelectedProducts([]); // Clear selected products after deletion
            toast.success("Các sản phẩm đã được xóa thành công");
          } else {
            toast.error("Xóa sản phẩm thất bại");
          }
        })
        .catch((error) => {
          console.error("Lỗi khi xóa sản phẩm:", error);
          toast.error("Đã xảy ra lỗi khi xóa sản phẩm");
        });
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (location.state && location.state.success) {
      toast.success(location.state.message);
    }
  }, [location.state]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Quản lý sản phẩm</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2 bg-white rounded-lg shadow">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Tìm kiếm sản phẩm"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products/add"
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" /> Tạo sản phẩm
          </Link>
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
            disabled={selectedProducts.length === 0} // Disable if no products are selected
          >
            <TrashIcon className="h-5 w-5" /> Xoá các lựa chọn
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {isLoading ? ( // Hiển thị loading trong bảng
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
            <span className="ml-4 text-lg">
              Đang tải sản phẩm, vui lòng chờ...
            </span>
          </div>
        ) : (
          <table className="w-full min-w-max border-collapse">
            <thead className="bg-white">
              <tr>
                <th className="border-b p-4 w-1 text-left">Chọn</th>
                <th className="border-b p-4 text-left">Tên sản phẩm</th>
                <th className="border-b p-4 text-left">Danh mục</th>
                <th className="border-b p-4 text-left">Giá</th>
                <th className="border-b p-4 text-left">Giá Sale</th>
                <th className="border-b p-4 text-left">Trạng thái</th>
                <th className="border-b p-4 text-left">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {listProducts.map((item) => (
                <tr key={item.ProductID} className="hover:bg-gray-50">
                  <td className=" p-1 text-center">
                    <Checkbox
                      checked={selectedProducts.includes(item.ProductID)}
                      onChange={() => handleSelectProduct(item.ProductID)}
                      className="border-2 border-gray-400"
                    />
                  </td>
                  <td className=" p-4 flex items-center">
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
                  <td className=" p-4">{item.category_name}</td>
                  <td className=" p-4">{item.Price}</td>
                  <td className=" p-4">{item.SalePrice}</td>
                  <td className=" p-4">
                    <ToggleSwitch
                      isOn={item.Status === "ACTIVE"}
                      handleToggle={() => handleToggleActive(item)}
                    />
                  </td>
                  <td className=" p-4 flex items-center mb-7">
                    <Link
                      to={`/admin/products/detail/${item.ProductID}`}
                      className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/admin/products/edit/${item.ProductID}`}
                      className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(item.ProductID)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
