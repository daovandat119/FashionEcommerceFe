import React, { useEffect, useState, useCallback } from "react";
import { Input, Checkbox } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ToggleSwitch from "../components/ToggleSwitch";
import { Link, useLocation } from "react-router-dom";
import { ListCategories, DeleteCategories, UpdateCategoryStatus } from "../service/api_service"; // Import hàm mới
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriesList = () => {
  const [ListCategory, setListCategory] = useState([]);
  const [TotalCategory, setTotalCategory] = useState(0);
  const [TotalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state cho từ khóa tìm kiếm
  const location = useLocation();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [updating, setUpdating] = useState(false); // Thêm biến cờ
  const [statusUpdate, setStatusUpdate] = useState(null); // Thêm state để lưu thông tin cập nhật trạng thái
  const [isLoading, setIsLoading] = useState(false); // Biến cờ để theo dõi trạng thái tải

  // Biến để theo dõi số lần gọi API
  const [apiCallCount, setApiCallCount] = useState(0);
  const [apiCallTimeout, setApiCallTimeout] = useState(null);

  // Gọi API khi component được mount
  useEffect(() => {
    setIsLoading(true); // Đặt cờ đang tải
    getCategories(currentPage, searchTerm);
  }, []); // Chỉ gọi một lần khi component được mount

  useEffect(() => {
    if (location.state?.success && location.state?.newCategory) {
      setListCategory((prevList) => [location.state.newCategory, ...prevList]);
      setTotalCategory((prevTotal) => prevTotal + 1);

      toast.success("Thêm danh mục thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      window.history.replaceState({}, document.title);
    }
  }, [location]); // Chỉ gọi khi location thay đổi

  useEffect(() => {
    if (statusUpdate) {
      const { CategoryID, status } = statusUpdate;
      UpdateCategoryStatus(CategoryID, { Status: status })
        .then(response => {
          console.log("Response from API:", response);
          if (response.success) {
            toast.success(response.message);
          } else {
            toast.error("Cập nhật trạng thái không thành công");
          }
        })
        .catch(error => {
          console.error("Lỗi khi cập nhật trạng thái danh mục:", error);
          toast.error("Đã xảy ra lỗi khi cập nhật trạng thái danh mục");
        })
        .finally(() => {
          setStatusUpdate(null); // Đặt lại state sau khi hoàn thành
        });
    }
  }, [statusUpdate]); // Chạy effect khi statusUpdate thay đổi

  const getCategories = useCallback((page, search = "") => {
    if (isLoading) return; // Ngăn chặn nếu đang tải
    if (apiCallCount >= 10) {
      toast.error("Thao tác quá nhanh, vui lòng thử lại sau.");
      return; // Chặn gọi API nếu đã gọi quá 10 lần
    }

    setIsLoading(true);
    ListCategories(page, search)
      .then(res => {
        if (res && res.data) {
          setTotalCategory(res.total);
          setListCategory(res.data.map(item => ({ ...item, isActive: item.Status === "ACTIVE" }))); // Thiết lập trạng thái
          setTotalPages(res.totalPage);
          setCurrentPage(page);
          setApiCallCount(prev => prev + 1); // Tăng số lần gọi API
        }
      })
      .catch(error => {
        console.error("Lỗi khi lấy danh mục:", error);
        toast.error("Không thể tải danh mục");
      })
      .finally(() => {
        setIsLoading(false); // Đặt lại cờ sau khi hoàn thành
      });
  }, [isLoading, apiCallCount]);

  // Reset apiCallCount sau 10 giây
  useEffect(() => {
    if (apiCallCount > 0) {
      if (apiCallTimeout) clearTimeout(apiCallTimeout); // Xóa timeout cũ
      setApiCallTimeout(setTimeout(() => {
        setApiCallCount(0); // Đặt lại số lần gọi API
      }, 10000)); // 10 giây
    }
  }, [apiCallCount]);

  const handleSearch = useCallback(() => {
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    getCategories(1, searchTerm); // Gọi API với từ kh��a tìm kiếm
  }, [searchTerm, getCategories]);

  const handlePageClick = useCallback((event) => {
    const newPage = event.selected + 1;
    setCurrentPage(newPage); // Cập nhật trang hiện tại
  }, []);

  const handleSelectCategory = useCallback((CategoryID) => {
    setSelectedCategories((prev) =>
      prev.includes(CategoryID)
        ? prev.filter((id) => id !== CategoryID)
        : [...prev, CategoryID]
    );
  }, []);

  const handleDeleteCategories = useCallback((CategoryIDs) => {
    if (CategoryIDs.length === 0) {
      toast.warn("Vui lòng chọn ít nhất một danh mục để xóa");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa các danh mục đã chọn?")) {
      DeleteCategories(CategoryIDs)
        .then(response => {
          if (response && response.message === "Operation completed") {
            const results = response.results || [];
            const deletedCount = results.filter((r) => r.message === "Deleted successfully").length;

            if (deletedCount > 0) {
              toast.success(`Đã xóa ${deletedCount} danh mục thành công`);
              getCategories(currentPage); // Tải lại danh sách
            }
          } else {
            throw new Error("Không thể xóa danh mục");
          }
        })
        .catch(error => {
          console.error("Lỗi khi xóa danh mục:", error);
          toast.error("Xóa danh mục thất bại: " + (error.response?.data?.message || error.message));
        });
    }
  }, [currentPage]);

  const handleToggle = useCallback((CategoryID) => {
    if (updating) return; // Ngăn chặn nếu đang cập nhật

    setUpdating(true); // Đặt cờ đang cập nhật
    console.log("Toggling status for CategoryID:", CategoryID); // Kiểm tra số lần gọi

    // Cập nhật trạng thái
    setListCategory((prevList) =>
      prevList.map((item) => {
        if (item.CategoryID === CategoryID) {
          const newStatus = !item.isActive; // Đảo ngược trạng thái
          setStatusUpdate({ CategoryID, status: newStatus ? "ACTIVE" : "INACTIVE" }); // Lưu thông tin vào state
          return { ...item, isActive: newStatus }; // Cập nhật trạng thái trong danh sách
        }
        return item;
      })
    );

    setUpdating(false); // Đặt lại cờ sau khi cập nhật
  }, [updating]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Categories Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search categories"
            value={searchTerm} // Gán giá trị từ state
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
          />
        </div>
        <div className='flex gap-2'>
          <Link
            to="/admin/categories/add"
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" /> New Category
          </Link>
          <button
            onClick={() => handleDeleteCategories(selectedCategories)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
          >
            <TrashIcon className="h-5 w-5" /> Delete Selected
          </button>
        </div>
      </div>
      {isLoading ? ( // Kiểm tra trạng thái tải
        <div className="flex justify-center items-center h-64">
          <span className="text-lg">Đang tải danh mục...</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full min-w-max border-collapse">
            <thead className="bg-white">
              <tr>
                <th className="border-b p-4 w-1/6 text-left">Select</th>
                <th className="border-b p-4 text-left">Name</th>
                <th className="border-b p-4 text-left">Active</th>
                <th className="border-b p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ListCategory.map((item) => (
                <tr key={item.CategoryID} className="hover:bg-gray-50">
                  <td className="border-b p-1">
                    <Checkbox
                      checked={selectedCategories.includes(item.CategoryID)}
                      onChange={() => handleSelectCategory(item.CategoryID)}
                      className="border-2 border-gray-400"
                    />
                  </td>
                  <td className="border-b p-4">{item.CategoryName}</td>
                  <td className="border-b p-4">
                    <ToggleSwitch
                      isOn={item.isActive} // Truyền trạng thái isActive vào ToggleSwitch
                      handleToggle={() => handleToggle(item.CategoryID)} // Gọi hàm toggle
                    />
                  </td>
                  <td className="border-b p-4">
                    <Link
                      to={`/admin/categories/edit/${item.CategoryID}`}
                      className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteCategories([item.CategoryID])} // Gọi hàm xóa với ID của danh mục
                      className="bg-red-500 text-white p-2 rounded-full mr-2 hover:bg-red-600 transition-colors inline-flex items-center justify-center"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {TotalPages > 1 && (
            <ReactPaginate
              breakLabel="..."
              nextLabel=" >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={TotalPages}
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

export default CategoriesList;
