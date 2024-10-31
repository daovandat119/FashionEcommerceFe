import React, { useEffect, useState, useCallback } from "react";
import { Input, Checkbox } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ToggleSwitch from "../components/ToggleSwitch";
import { Link, useLocation } from "react-router-dom";
import { ListCategories, DeleteCategories, UpdateCategoryStatus } from "../service/api_service";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

const CategoriesList = () => {
  const [ListCategory, setListCategory] = useState([]);
  const [TotalCategory, setTotalCategory] = useState(0);
  const [TotalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Biến cờ để theo dõi trạng thái tải

  // Gọi API khi component được mount
  useEffect(() => {
    setIsLoading(true);
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
  }, [location]);

  const getCategories = useCallback((page, search = "") => {
    if (isLoading) return; // Ngăn chặn nếu đang tải

    setIsLoading(true);
    ListCategories(page, search)
      .then(res => {
        if (res && res.data) {
          setTotalCategory(res.total);
          setListCategory(res.data.map(item => ({ ...item, isActive: item.Status === "ACTIVE" })));
          setTotalPages(res.totalPage);
          setCurrentPage(page);
        }
      })
      .catch(error => {
        console.error("Lỗi khi lấy danh mục:", error);
        toast.error("Không thể tải danh mục");
      })
      .finally(() => {
        setIsLoading(false); // Đặt lại cờ sau khi hoàn thành
      });
  }, [isLoading]);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    getCategories(1, searchTerm);
  }, [searchTerm, getCategories]);

  const handlePageClick = useCallback((event) => {
    const newPage = event.selected + 1;
    setCurrentPage(newPage);
    getCategories(newPage, searchTerm);
  }, [searchTerm, getCategories]);

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
              getCategories(currentPage);
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
    if (updating) return;

    setUpdating(true);
    setListCategory((prevList) =>
      prevList.map((item) => {
        if (item.CategoryID === CategoryID) {
          const newStatus = item.Status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          UpdateCategoryStatus(CategoryID, { Status: newStatus })
            .then(() => {
              toast.success(`Cập nhật trạng thái thành công`);
              getCategories(currentPage);
            })
            .catch((error) => {
              console.error("Lỗi khi cập nhật trạng thái:", error);
              toast.error("Cập nhật trạng thái thất bại");
            });
          return { ...item, Status: newStatus };
        }
        return item;
      })
    );

    setUpdating(false);
  }, [updating, currentPage]);

  const handleSearchChange = (e) => {
    const value = e.target.value; // Get the current input value
    setSearchTerm(value); // Update the search term
    setCurrentPage(1); // Reset to the first page on search
    getCategories(1, value); // Call getCategories with the updated search term
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Categories Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search categories"
            value={searchTerm}
            onChange={handleSearchChange}
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

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {isLoading ? ( // Hiển thị loading trong bảng
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
            <span className="ml-4 text-lg">Đang tải danh mục, vui lòng chờ...</span>
          </div>
        ) : (
          <table className="w-full min-w-max border-collapse">
            <thead className="bg-white">
              <tr className="text-center">
                <th className="border-b p-4 w-1/6 ">Select</th>
                <th className="border-b p-4 ">Name</th>
                <th className="border-b p-4 ">Active</th>
                <th className="border-b p-4 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ListCategory.map((item) => (
                <tr key={item.CategoryID} className="hover:bg-gray-50 text-center">
                  <td className="border-b w-1 p-1">
                    <Checkbox
                      checked={selectedCategories.includes(item.CategoryID)}
                      onChange={() => handleSelectCategory(item.CategoryID)}
                      className="border-2 border-gray-400"
                    />
                  </td>
                  <td className="border-b p-4">{item.CategoryName}</td>
                  <td className="border-b p-4">
                    <ToggleSwitch
                      isOn={item.Status === "ACTIVE"}
                      handleToggle={() => handleToggle(item.CategoryID)}
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
                      onClick={() => handleDeleteCategories([item.CategoryID])}
                      className="bg-red-500 text-white p-2 rounded-full mr-2 hover:bg-red-600 transition-colors inline-flex items-center justify-center"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {TotalPages > 1 && (
         <div className="pb-4">
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
         </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesList;
