import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Checkbox, Input } from '@material-tailwind/react';
import { Link, useLocation } from 'react-router-dom';
import ToggleSwitch from '../components/ToggleSwitch';
import { ListColors, DeleteColors } from '../service/api_service';
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ColorList = () => {
  const [colors, setColors] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColors, setSelectedColors] = useState([]);
  const location = useLocation();

  useEffect(() => {
    getColors(1);
    
    if (location.state?.success) {
      toast.success(location.state.message || "Thao tác thành công!");
      if (location.state.updatedColor) {
        setColors(prevColors => prevColors.map(color => 
          color.ColorID === location.state.updatedColor.ColorID ? location.state.updatedColor : color
        ));
      }
      // Xóa state để tránh hiển thị lại thông báo khi reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const getColors = async (page) => {
    try {
      const res = await ListColors(page);
      if (res && res.data) {
        const updatedColors = res.data.map(color => ({
          ...color,
          isActive: localStorage.getItem(`color-${color.ColorID}`) === 'true' || true // Mặc định là true nếu không có trong localStorage
        }));
        setColors(updatedColors);
        setTotalPages(res.totalPage);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    getColors(newPage);
  };

  const handleSelectColor = (ColorID) => {
    setSelectedColors(prev => 
      prev.includes(ColorID) 
        ? prev.filter(id => id !== ColorID)
        : [...prev, ColorID]
    );
  };

  const handleDeleteColors = async (ColorIDs = selectedColors) => {
    if (ColorIDs.length === 0) return;

    if (window.confirm("Bạn có chắc chắn muốn xóa các màu đã chọn?")) {
      try {
        for (const ColorID of ColorIDs) {
          await DeleteColors(ColorID);
        }
        toast.success("Xóa thành công");
        getColors(currentPage); // Tải lại danh sách
        setSelectedColors([]); // Reset danh sách đã chọn
      } catch (error) {
        console.error("Lỗi khi xóa màu sắc:", error);
        toast.error("Xóa không thành công: " + error.message);
      }
    }
  };

  const handleToggle = (ColorID) => {
    setColors(prevColors => {
      const updatedColors = prevColors.map(color =>
        color.ColorID === ColorID ? { ...color, isActive: !color.isActive } : color
      );

      // Lưu trạng thái mới vào localStorage
      updatedColors.forEach(color => {
        localStorage.setItem(`color-${color.ColorID}`, color.isActive);
      });

      return updatedColors;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Colors Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2 bg-white rounded-lg shadow">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search colors"
          />
        </div>
        <Link to="/admin/colors/add" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
          <PlusIcon className="h-5 w-5" /> New Color
        </Link>
        <button
          onClick={() => handleDeleteColors()}
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
        >
          <TrashIcon className="h-5 w-5" /> Delete Selected
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-max border-collapse">
          <thead className="bg-white">
            <tr>
              <th className="border-b p-4 w-1/6 text-left">Select</th>
              <th className="border-b p-4 text-left">Color</th>
              <th className="border-b p-4 text-left">Active</th>
              <th className="border-b p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
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
                <td className="border-b p-4">
                  <ToggleSwitch
                    isOn={color.isActive} // Truyền trạng thái isActive vào ToggleSwitch
                    handleToggle={() => handleToggle(color.ColorID)} // Gọi hàm toggle
                  />
                </td>
                <td className="border-b p-4">
                  <Link
                    to={`/admin/colors/edit/${color.ColorID}`}
                    className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteColors([color.ColorID])}
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

export default ColorList;
