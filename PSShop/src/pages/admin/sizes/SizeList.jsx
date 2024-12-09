import React, { useCallback, useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Checkbox, Input } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import {
  ListSizes,
  DeleteSizes,
  toggleSizeStatus,
} from "../service/api_service";
import Swal from "sweetalert2"; // Import SweetAlert
import { FaSpinner } from "react-icons/fa"; // Import spinner icon
import ToggleSwitch from "../components/ToggleSwitch";

const SizeList = () => {
  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false); // Trạng thái để theo dõi việc đã gọi API

  const getSizes = async () => {
    setIsLoading(true); // Bắt đầu loading
    try {
      const res = await ListSizes();
      if (res && res.data) {
        setSizes(res.data); // Mặc định là bật
      }
    } catch (error) {
      console.error("Error fetching sizes:", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách kích thước", "error");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      // Chỉ gọi API nếu chưa gọi trước đó
      getSizes();
      setHasFetched(true); // Đánh dấu là đã gọi API
    }

    // Hiển thị thông báo thành công khi thêm kích thước
    if (location.state?.success) {
      Swal.fire(
        "Thành công!",
        location.state.message || "Thao tác thành công!",
        "success"
      );

      // Logic mới cho việc thêm kích thước mới
      if (location.state?.newSize) {
        setSizes((prevSizes) => [location.state.newSize, ...prevSizes]);
        setTotalPages((prevTotal) => prevTotal + 1);
      }

      window.history.replaceState({}, document.title);
    }
  }, [location, hasFetched]);

  const handleSelectSize = (SizeID) => {
    setSelectedSizes((prev) =>
      prev.includes(SizeID)
        ? prev.filter((id) => id !== SizeID)
        : [...prev, SizeID]
    );
  };

  const handleDeleteSizes = async (SizeIDs = selectedSizes) => {
    if (SizeIDs.length === 0) return;

    if (window.confirm("Bạn có chắc chắn muốn xóa các kích thước đã chọn?")) {
      const deletePromises = SizeIDs.map((SizeID) => DeleteSizes(SizeID));
      try {
        await Promise.all(deletePromises);
        Swal.fire("Thành công!", "Xóa thành công", "success");
        getSizes(); // Tải lại danh sách
        setSelectedSizes([]); // Reset danh sách đã chọn
      } catch (error) {
        console.error("Lỗi khi xóa kích thước:", error);
        Swal.fire("Lỗi!", "Xóa không thành công: " + error.message, "error");
      }
    }
  };

  const handleToggle = useCallback(async (ColorID) => {
    try {
      await toggleSizeStatus(ColorID);
      await getSizes();
    } catch (error) {
      console.error("Lỗi khi xóa màu sắc:", error);
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý kích thước</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Tìm kiếm kích thước"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg"
          />
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/sizes/add"
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" /> Tạo kích thước
          </Link>
          <button
            onClick={() => handleDeleteSizes()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
          >
            <TrashIcon className="h-5 w-5" /> Xoá các lựa chọn
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow border-2">
        {isLoading ? ( // Hiển thị loading trong bảng
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
            <span className="ml-4 text-lg">
              Đang tải kích thước, vui lòng chờ...
            </span>
          </div>
        ) : (
          <table className="w-full min-w-max border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="border-b p-4 ">Lựa chọn</th>
                <th className="border-b p-4 ">Kích thước</th>
                <th className="border-b p-4 ">Trạng thái</th>
                <th className="border-b p-4 ">Chức năng</th>
              </tr>
            </thead>
            <tbody className="text-center">
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
                  <td className="border-b p-8 flex items-center justify-center">
                    <ToggleSwitch
                      isOn={size.status === "ACTIVE"}
                      handleToggle={() => handleToggle(size.SizeID)}
                    />
                  </td>
                  <td className="border-b p-4 ">
                    <Link
                      to={`/admin/sizes/edit/${size.SizeID}`}
                      className="bg-blue-500 text-white p-2 mx-2 rounded-full hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteSizes([size.SizeID])}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors inline-flex items-center justify-center"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SizeList;
