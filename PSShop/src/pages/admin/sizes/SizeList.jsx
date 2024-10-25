import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Checkbox, Input } from '@material-tailwind/react';
import { Link, useLocation } from 'react-router-dom';
import ToggleSwitch from '../components/ToggleSwitch';
import { ListSizes, DeleteSizes } from '../service/api_service';
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SizeList = () => {
  const [sizes, setSizes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const location = useLocation();

  useEffect(() => {
    getSizes(1);
    
    if (location.state?.success) {
      toast.success(location.state.message || "Thao tác thành công!");
      if (location.state.updatedSize) {
        setSizes(prevSizes => prevSizes.map(size => 
          size.SizeID === location.state.updatedSize.SizeID ? location.state.updatedSize : size
        ));
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const getSizes = (page) => {
    ListSizes(page)
      .then(res => {
        if (res && res.data) {
          setSizes(res.data.map(size => ({ ...size, isActive: true }))); // Mặc định là bật
          setTotalPages(res.totalPage);
          setCurrentPage(page);
        }
      })
      .catch(error => {
        console.error("Error fetching sizes:", error);
        toast.error("Không thể tải danh sách kích thước");
      });
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    getSizes(newPage);
  };

  const handleSelectSize = (SizeID) => {
    setSelectedSizes(prev => 
      prev.includes(SizeID) 
        ? prev.filter(id => id !== SizeID)
        : [...prev, SizeID]
    );
  };

  const handleDeleteSizes = (SizeIDs = selectedSizes) => {
    if (SizeIDs.length === 0) return;

    if (window.confirm("Bạn có chắc chắn muốn xóa các kích thước đã chọn?")) {
      const deletePromises = SizeIDs.map(SizeID => DeleteSizes(SizeID));
      Promise.all(deletePromises)
        .then(() => {
          toast.success("Xóa thành công");
          getSizes(currentPage); // Tải lại danh sách
          setSelectedSizes([]); // Reset danh sách đã chọn
        })
        .catch(error => {
          console.error("Lỗi khi xóa kích thước:", error);
          toast.error("Xóa không thành công: " + error.message);
        });
    }
  };

  const handleToggle = (SizeID) => {
    setSizes(prevSizes =>
      prevSizes.map(size =>
        size.SizeID === SizeID ? { ...size, isActive: !size.isActive } : size
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Sizes Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2 bg-white rounded-lg shadow">
          <Input 
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search sizes"
          />
        </div>
        <Link to="/admin/sizes/add" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
          <PlusIcon className="h-5 w-5" /> New Size
        </Link>
        <button
          onClick={() => handleDeleteSizes()}
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
              <th className="border-b p-4 text-left">Size</th>
              <th className="border-b p-4 text-left">Active</th>
              <th className="border-b p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((size) => (
              <tr key={size.SizeID} className="hover:bg-gray-50">
                <td className="border-b p-1">
                  <Checkbox
                    checked={selectedSizes.includes(size.SizeID)}
                    onChange={() => handleSelectSize(size.SizeID)}
                    className="border-2 border-gray-400"
                  />
                </td>
                <td className="border-b p-4">{size.SizeName}</td>
                <td className="border-b p-4">
                  <ToggleSwitch
                    isOn={size.isActive} // Truyền trạng thái isActive vào ToggleSwitch
                    handleToggle={() => handleToggle(size.SizeID)} // Gọi hàm toggle
                  />
                </td>
                <td className="border-b p-4">
                  <Link
                    to={`/admin/sizes/edit/${size.SizeID}`}
                    className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteSizes([size.SizeID])}
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

export default SizeList;
