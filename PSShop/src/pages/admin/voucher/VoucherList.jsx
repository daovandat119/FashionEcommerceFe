import React, { useEffect, useState } from "react";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"; // Import icons
import { GetCoupons, DeleteVouchers } from "../service/api_service"; // Import the GetCoupons and DeleteVouchers function
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSpinner } from "react-icons/fa"; // Import spinner icon
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Import search icon
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]); // State to hold voucher data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(""); // State to manage error message
  const [searchTerm, setSearchTerm] = useState(""); // State to hold search term
  const [selectedVouchers, setSelectedVouchers] = useState([]); // State to hold selected voucher IDs
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await GetCoupons(); // Call the API to get vouchers
        setVouchers(response.data); // Set the vouchers state with the response data
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        setError("Không thể lấy danh sách voucher. Vui lòng kiểm tra lại."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchVouchers(); // Fetch vouchers on component mount

    // Kiểm tra thông báo thành công từ localStorage
    const message = localStorage.getItem('successMessage');
    if (message) {
      toast.success(message); // Hiển thị thông báo thành công
      localStorage.removeItem('successMessage'); // Xóa thông báo sau khi hiển thị
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Cập nhật giá trị tìm kiếm
  };

  const handleCheckboxChange = (couponID) => {
    setSelectedVouchers((prevSelected) => {
      if (prevSelected.includes(couponID)) {
        return prevSelected.filter((id) => id !== couponID); // Bỏ chọn
      } else {
        return [...prevSelected, couponID]; // Chọn
      }
    });
  };

  const handleDeleteSelected = async () => {
    // Xử lý xóa các voucher đã chọn
    if (selectedVouchers.length === 0) {
      toast.error("Vui lòng chọn ít nhất một voucher để xóa.");
      return;
    }

    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa các voucher đã chọn không?");
    if (!confirmDelete) return;

    try {
      await DeleteVouchers(selectedVouchers); // Gọi API xóa voucher
      toast.success("Đã xóa các voucher đã chọn.");
      setSelectedVouchers([]); // Reset danh sách đã chọn
      // Cập nhật lại danh sách voucher
      const updatedVouchers = vouchers.filter(voucher => !selectedVouchers.includes(voucher.CouponID));
      setVouchers(updatedVouchers);
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
      toast.error("Có lỗi xảy ra khi xóa voucher.");
    }
  };

  const handleDeleteSingle = async (couponID) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa voucher này không?");
    if (!confirmDelete) return;

    try {
      await DeleteVouchers([couponID]); // Gọi API xóa voucher
      toast.success("Voucher đã được xóa.");
      // Cập nhật lại danh sách voucher
      const updatedVouchers = vouchers.filter(voucher => voucher.CouponID !== couponID);
      setVouchers(updatedVouchers);
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
      toast.error("Có lỗi xảy ra khi xóa voucher.");
    }
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.Name.toLowerCase().includes(searchTerm.toLowerCase()) // Lọc voucher theo tên
  );

  if (error) {
    return <Typography variant="h6" className="text-center text-red-500">Error: {error}</Typography>; // Show error message
  }

  return (
    <>
      <ToastContainer /> {/* Thêm ToastContainer */}
      <Typography variant="h5" className="text-2xl font-bold mb-6 ml-5">
        Quản lý mã giảm giá
      </Typography>
      <div className="flex justify-between items-center mb-6 w-[96%] mx-auto ">
        <div className="w-1/2 bg-white rounded-xl">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search voucher"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full "
          />
        </div>
        <div className="flex">
          <Button
            color="green"
            className="ml-4 h-10 flex items-center" // Thêm khoảng cách bên trái
            onClick={() => navigate('/admin/vouchers/add')} // Navigate to Add Voucher page
          >
            New Voucher
          </Button>
          <Button
            color="red"
            className="ml-4 h-10 flex items-center" // Thêm khoảng cách bên trái
            onClick={handleDeleteSelected} // Xóa các voucher đã chọn
          >
            Delete Selected
          </Button>
        </div>
      </div>
      <Card className="p-4 w-[96%] mx-auto">
        {loading ? ( // Check if loading
          <div className="flex justify-center items-center">
            <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
            <span className="ml-4 text-lg">Đang tải danh sách voucher, vui lòng chờ...</span>
          </div>
        ) : (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="text-center">
                <th className="border border-gray-300 p-2">Select</th>
                <th className="border border-gray-300 p-2">Voucher</th>
                <th className="border border-gray-300 p-2">Code</th>
                <th className="border border-gray-300 p-2">Phần trăm giảm giá</th>
                <th className="border border-gray-300 p-2">Đơn tối thiểu</th>
                <th className="border border-gray-300 p-2">Số lượng</th>
                <th className="border border-gray-300 p-2">Đã sử dụng</th>
                <th className="border border-gray-300 p-2">Ngày hết hạn</th>
                <th className="border border-gray-300 p-2">Tùy chỉnh</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredVouchers.map((voucher) => (
                <tr key={voucher.CouponID}>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="checkbox"
                      checked={selectedVouchers.includes(voucher.CouponID)}
                      onChange={() => handleCheckboxChange(voucher.CouponID)} // Xử lý thay đổi checkbox
                    />
                  </td>
                  <td className="border border-gray-300 p-2">{voucher.Name}</td>
                  <td className="border border-gray-300 p-2">{voucher.Code}</td>
                  <td className="border border-gray-300 p-2">{voucher.DiscountPercentage}%</td>
                  <td className="border border-gray-300 p-2">{voucher.MinimumOrderValue} VNĐ</td>
                  <td className="border border-gray-300 p-2">{voucher.UsageLimit}</td>
                  <td className="border border-gray-300 p-2">{voucher.UsedCount}</td>
                  <td className="border border-gray-300 p-2">{voucher.ExpiresAt}</td>
                  <td className="border border-gray-300 p-2 flex space-x-2 justify-center">
                    <span 
                      className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-500 transition-colors inline-flex items-center justify-center cursor-pointer"
                      onClick={() => navigate(`/admin/vouchers/edit/${voucher.CouponID}`)} // Navigate to UpdateVoucher
                    >
                      <PencilIcon className="h-4 w-4" title="Chỉnh sửa" />
                    </span>
                    <span 
                      className="bg-red-600 text-white p-1 rounded-full hover:bg-red-500 transition-colors inline-flex items-center justify-center cursor-pointer"
                      onClick={() => handleDeleteSingle(voucher.CouponID)} // Xóa voucher đơn lẻ
                    >
                      <TrashIcon className="h-4 w-4" title="Xóa" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
};

export default VoucherList;
