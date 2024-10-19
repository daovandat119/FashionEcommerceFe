import React, { useEffect, useState } from "react";
import { Input, Checkbox } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ToggleSwitch from "../components/ToggleSwitch";
import { Link, useLocation } from "react-router-dom";
import { ListCategories, DeleteCategories } from "../service/api_service";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriesList = () => {
  const [ListCategory, setListCategory] = useState([]);
  const [TotalCategory, setTotalCategory] = useState(0);
  const [TotalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    getCategories(1);

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

  const getCategories = async (page) => {
    let res = await ListCategories(page);
    if (res && res.data) {
      setTotalCategory(res.total);
      setListCategory(res.data);
      setTotalPages(res.totalPage);
      setCurrentPage(page);
    }
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    getCategories(newPage);
  };

  const handleSelectCategory = (CategoryID) => {
    setSelectedCategories((prev) =>
      prev.includes(CategoryID)
        ? prev.filter((id) => id !== CategoryID)
        : [...prev, CategoryID]
    );
  };

  const handleDeleteCategories = async (CategoryIDs) => {
    if (CategoryIDs.length === 0) {
      toast.warn("Vui lòng chọn ít nhất một danh mục để xóa");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa các danh mục đã chọn?")) {
      try {
        const response = await DeleteCategories(CategoryIDs);
        if (response && response.message === "Operation completed") {
          const results = response.results || [];
          const deletedCount = results.filter((r) => r.message === "Deleted successfully").length;

          if (deletedCount > 0) {
            toast.success(`Đã xóa ${deletedCount} danh mục thành công`);
            getCategories(currentPage); // Tải lại danh sách
            setSelectedCategories([]); // Reset danh sách đã chọn
          } else {
            toast.warn("Không có danh mục nào được xóa");
          }

          const notFoundIds = results.filter((r) => r.message === "Category not found").map((r) => r.id);
          if (notFoundIds.length > 0) {
            toast.info(`Không tìm thấy danh mục với ID: ${notFoundIds.join(", ")}`);
          }
        } else {
          throw new Error("Không thể xóa danh mục");
        }
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        toast.error("Xóa danh mục thất bại: " + (error.response?.data?.message || error.message));
      }
    }
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
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
          />
        </div>
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
          <TrashIcon className="h-5 w-5" /> Xóa đã chọn
        </button>
      </div>
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
                  <ToggleSwitch />
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
    </div>
  );
};

export default CategoriesList;