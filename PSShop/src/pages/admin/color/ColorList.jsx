import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Checkbox, Input } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import { ListColors, DeleteColors } from "../service/api_service";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ColorList = () => {
  const [colors, setColors] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColors, setSelectedColors] = useState([]);
  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false); // Trạng thái để theo dõi việc đã gọi API
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  const getColors = async (page) => {
    setIsLoading(true); // Bắt đầu loading
    try {
      const res = await ListColors(page);
      if (res && res.data) {
        setColors(
          res.data.map((item) => ({
            ...item,
            isActive: true, // Mặc định là Active
          }))
        );
        setTotalPages(res.totalPage);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
      toast.error("Không thể tải danh sách màu sắc");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    if (!hasFetched) { // Chỉ gọi API nếu chưa gọi trước đó
      getColors(1); // Gọi hàm getColors khi component mount
      setHasFetched(true); // Đánh dấu là đã gọi API
    }

    if (location.state?.success) {
      toast.success(location.state.message || "Thao tác thành công!", {
        autoClose: 3000,
      });
      if (location.state.updatedColor) {
        setColors((prevColors) =>
          prevColors.map((color) =>
            color.ColorID === location.state.updatedColor.ColorID
              ? location.state.updatedColor
              : color
          )
        );
      }
      window.history.replaceState({}, document.title);
    }
  }, [location, hasFetched]);

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    if (newPage !== currentPage) {
      getColors(newPage); // Gọi lại getColors khi trang thay đổi
    }
  };

  const handleSelectColor = (ColorID) => {
    setSelectedColors((prev) =>
      prev.includes(ColorID)
        ? prev.filter((id) => id !== ColorID)
        : [...prev, ColorID]
    );
  };

  const handleDeleteColors = async (ColorIDs = selectedColors) => {
    if (ColorIDs.length === 0) return;

    if (window.confirm("Bạn có chắc chắn muốn xóa các màu đã chọn?")) {
      const deletePromises = ColorIDs.map((ColorID) => DeleteColors(ColorID));
      try {
        await Promise.all(deletePromises);
        toast.success("Xóa thành công");
        getColors(currentPage); // Gọi lại danh sách màu sắc
        setSelectedColors([]); // Đặt lại danh sách màu đã chọn
      } catch (error) {
        console.error("Lỗi khi xóa màu sắc:", error);
        toast.error("Xóa không thành công: " + error.message);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6 ">Colors Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search colors"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg"
          />
        </div>
        <div className="flex space-x-2">
          <Link
            to="/admin/colors/add"
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" /> New Color
          </Link>
          <button
            onClick={() => handleDeleteColors()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
          >
            <TrashIcon className="h-5 w-5" /> Delete Selected
          </button>
        </div>
      </div>
      {isLoading ? ( // Hiển thị loading
        <div className="flex justify-center items-center h-64">
          <span className="text-lg">Đang tải màu sắc...</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border-2">
          <table className="w-full min-w-max border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="border-b p-4 ">Select</th>
                <th className="border-b p-4 ">Color</th>
                <th className="border-b p-4 ">Active</th>
                <th className="border-b p-4 ">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {colors.map((color) => (
                <tr key={color.ColorID} className="hover:bg-gray-50">
                  <td className="border-b p-1">
                    <Checkbox
                      checked={selectedColors.includes(color.ColorID)}
                      onChange={() => handleSelectColor(color.ColorID)}
                      className="border-2 border-gray-400"
                    />
                  </td>
                  <td className="border-b p-4">{color.ColorName}</td>
                  <td className="border-b p-8 flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                    <span className="text-green-500 font-bold">Active</span>
                  </td>
                  <td className="border-b p-4 ">
                    <Link
                      to={`/admin/colors/edit/${color.ColorID}`}
                      className="bg-blue-500 text-white p-2 mx-2 rounded-full hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteColors([color.ColorID])}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors inline-flex items-center justify-center"
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
      )}
    </div>
  );
};

export default ColorList;
