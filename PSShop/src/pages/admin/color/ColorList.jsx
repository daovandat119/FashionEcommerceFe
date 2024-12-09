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
  ListColors,
  DeleteColors,
  toggleColorStatus,
} from "../service/api_service";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2"; // Import SweetAlert
import { FaSpinner } from "react-icons/fa"; // Import spinner icon
import ToggleSwitch from "../components/ToggleSwitch";

const ColorList = () => {
  const [colors, setColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false); // Trạng thái để theo dõi việc đã gọi API
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  const getColors = async () => {
    setIsLoading(true); // Bắt đầu loading
    try {
      const res = await ListColors();
      if (res && res.data) {
        setColors(res.data);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách màu sắc", "error");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      getColors(); // Gọi hàm getColors khi component mount
      setHasFetched(true); // Đánh dấu là đã gọi API
    }

    if (location.state?.success) {
      Swal.fire(
        "Thành công!",
        location.state.message || "Thao tác thành công!",
        "success"
      );

      // Logic mới cho việc thêm màu mới
      if (location.state?.newColor) {
        setColors((prevColors) => [location.state.newColor, ...prevColors]);
        setTotalPages((prevTotal) => prevTotal + 1);
      }

      window.history.replaceState({}, document.title);
    }
  }, [location, hasFetched]);

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
        Swal.fire("Thành công!", "Xóa thành công", "success");
        getColors();
        setSelectedColors([]);
      } catch (error) {
        console.error("Lỗi khi xóa màu sắc:", error);
        Swal.fire("Lỗi!", "Xóa không thành công: " + error.message, "error");
      }
    }
  };

  const handleToggle = useCallback(async (ColorID) => {
    try {
      await toggleColorStatus(ColorID);
      await getColors();
    } catch (error) {
      console.error("Lỗi khi xóa màu sắc:", error);
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 ">Quản lý màu sắc</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Tìm kiếm màu sắc"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg"
          />
        </div>
        <div className="flex space-x-2">
          <Link
            to="/admin/colors/add"
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" /> Tạo màu sắc
          </Link>
          <button
            onClick={() => handleDeleteColors()}
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
              Đang tải màu sắc, vui lòng chờ...
            </span>
          </div>
        ) : (
          <table className="w-full min-w-max border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="border-b p-4 ">Lựa chọn</th>
                <th className="border-b p-4 ">Màu sắc</th>
                <th className="border-b p-4 ">Trạng thái</th>
                <th className="border-b p-4 ">Chức năng</th>
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
                    <ToggleSwitch
                      isOn={color.status === "ACTIVE"}
                      handleToggle={() => handleToggle(color.ColorID)}
                    />
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
        )}
      </div>
    </div>
  );
};

export default ColorList;
