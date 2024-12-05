import React, { useCallback, useEffect, useState } from "react";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { GetCoupons, DeleteVouchers } from "../service/api_service";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDebounce } from "use-debounce";
import ReactPaginate from "react-paginate";

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearchValue] = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  const fetchVouchers = useCallback(async (page, debouncedSearchValue) => {
    try {
      const response = await GetCoupons(page, debouncedSearchValue);
      if (response.data) {
        setVouchers(response.data);
        setPage(response.page);
        setTotalPages(response.totalPage);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      setError("Không thể lấy danh sách voucher. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers(page, debouncedSearchValue);
  }, [page, debouncedSearchValue]);

  const handlePageChange = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      setPage(newPage);
      fetchVouchers(newPage);
    },
    [fetchVouchers]
  );

  const handleSearchChange = useCallback((searchValue) => {
    setSearchTerm(searchValue);
  }, []);

  useEffect(() => {
    handleSearchChange(debouncedSearchValue);
  }, [debouncedSearchValue]);

  const handleCheckboxChange = (couponID) => {
    setSelectedVouchers((prevSelected) => {
      if (prevSelected.includes(couponID)) {
        return prevSelected.filter((id) => id !== couponID);
      } else {
        return [...prevSelected, couponID];
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedVouchers.length === 0) {
      toast.error("Vui lòng chọn ít nhất một voucher để xóa.");
      return;
    }

    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa các voucher đã chọn không?"
    );
    if (!confirmDelete) return;

    try {
      await DeleteVouchers(selectedVouchers);
      toast.success("Đã xóa các voucher đã chọn.");
      setSelectedVouchers([]);
      const updatedVouchers = vouchers.filter(
        (voucher) => !selectedVouchers.includes(voucher.CouponID)
      );
      setVouchers(updatedVouchers);
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
      toast.error("Có lỗi xảy ra khi xóa voucher.");
    }
  };

  const handleDeleteSingle = async (couponID) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa voucher này không?"
    );
    if (!confirmDelete) return;

    try {
      await DeleteVouchers([couponID]);
      toast.success("Voucher đã được xóa.");
      const updatedVouchers = vouchers.filter(
        (voucher) => voucher.CouponID !== couponID
      );
      setVouchers(updatedVouchers);
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
      toast.error("Có lỗi xảy ra khi xóa voucher.");
    }
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <Typography variant="h6" className="text-center text-red-500">
        Error: {error}
      </Typography>
    );
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
            label="Tìm kiếm mã giảm giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full "
          />
        </div>
        <div className="flex">
          <Button
            color="green"
            className="ml-4 h-10 flex items-center"
            onClick={() => navigate("/admin/vouchers/add")}
          >
            Tạo mã giảm giá
          </Button>
          <Button
            color="red"
            className="ml-4 h-10 flex items-center"
            onClick={handleDeleteSelected}
          >
            Xoá các lựa chọn
          </Button>
        </div>
      </div>
      <Card className="p-4 w-[96%] mx-auto">
        {loading ? (
          <div className="flex justify-center items-center">
            <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
            <span className="ml-4 text-lg">
              Đang tải danh sách voucher, vui lòng chờ...
            </span>
          </div>
        ) : (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="text-center">
                <th className="border border-gray-300 p-2">Lựa chọn</th>
                <th className="border border-gray-300 p-2">Voucher</th>
                <th className="border border-gray-300 p-2">Code</th>
                <th className="border border-gray-300 p-2">
                  Phần trăm giảm giá
                </th>
                <th className="border border-gray-300 p-2">Đơn tối thiểu</th>
                <th className="border border-gray-300 p-2">Giá trị tối đa</th>
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
                      onChange={() => handleCheckboxChange(voucher.CouponID)}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">{voucher.Name}</td>
                  <td className="border border-gray-300 p-2">{voucher.Code}</td>
                  <td className="border border-gray-300 p-2">
                    {voucher.DiscountPercentage}%
                  </td>
                  <td className="border border-gray-300 p-2">
                    {voucher.MinimumOrderValue} VNĐ
                  </td>
                  <td className="border border-gray-300 p-2">
                    {voucher.MaxAmount} VNĐ
                  </td>
                  <td className="border border-gray-300 p-2">
                    {voucher.UsedCount}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {voucher.ExpiresAt}
                  </td>
                  <td className="border border-gray-300 p-2 flex space-x-2 justify-center">
                    <span
                      className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-500 transition-colors inline-flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        navigate(`/admin/vouchers/edit/${voucher.CouponID}`)
                      }
                    >
                      <PencilIcon className="h-4 w-4" title="Chỉnh sửa" />
                    </span>
                    <span
                      className="bg-red-600 text-white p-1 rounded-full hover:bg-red-500 transition-colors inline-flex items-center justify-center cursor-pointer"
                      onClick={() => handleDeleteSingle(voucher.CouponID)}
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
      {totalPages > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel=" >"
          onPageChange={handlePageChange}
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
          forcePage={page - 1}
        />
      )}
    </>
  );
};

export default VoucherList;
