import React, { useEffect, useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"; // Import icons
import { GetCoupons } from "../service/api_service"; // Import the GetCoupons function

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]); // State to hold voucher data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(""); // State to manage error message

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
  }, []);

  if (loading) {
    return <Typography variant="h6" className="text-center">Loading...</Typography>; // Show loading text
  }

  if (error) {
    return <Typography variant="h6" className="text-center text-red-500">Error: {error}</Typography>; // Show error message
  }

  return (
    <>
      <Typography variant="h5" className="text-2xl font-bold mb-6 ml-5">
        Voucher List
      </Typography>
      <Card className="p-4 w-[98%] mt-10 mx-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="text-center">
              <th className="border border-gray-300 p-2">STT</th>
              <th className="border border-gray-300 p-2">Voucher</th>
              <th className="border border-gray-300 p-2">Code</th>
              <th className="border border-gray-300 p-2">Phần trăm giảm giá</th>
              <th className="border border-gray-300 p-2">Đơn tối thiểu</th>
              <th className="border border-gray-300 p-2">Số lượng</th>
              <th className="border border-gray-300 p-2">Hiện còn</th>
              <th className="border border-gray-300 p-2">Ngày hết hạn</th>
              <th className="border border-gray-300 p-2">Tùy chỉnh</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {vouchers.map((voucher) => (
              <tr key={voucher.CouponID}>
                <td className="border border-gray-300 p-2">{voucher.CouponID}</td>
                <td className="border border-gray-300 p-2">{voucher.Name}</td>
                <td className="border border-gray-300 p-2">{voucher.Code}</td>
                <td className="border border-gray-300 p-2">{voucher.DiscountPercentage}%</td>
                <td className="border border-gray-300 p-2">{voucher.MinimumOrderValue} VNĐ</td>
                <td className="border border-gray-300 p-2">{voucher.UsageLimit}</td>
                <td className="border border-gray-300 p-2">{voucher.UsedCount}</td>
                <td className="border border-gray-300 p-2">{voucher.ExpiresAt}</td>
                <td className="border border-gray-300 p-2 flex space-x-2 justify-center">
                  <span className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-500 transition-colors inline-flex items-center justify-center">
                    <PencilIcon className="h-4 w-4" title="Chỉnh sửa" />
                  </span>
                  <span className="bg-red-600 text-white p-1 rounded-full hover:bg-red-500 transition-colors inline-flex items-center justify-center">
                    <TrashIcon className="h-4 w-4" title="Xóa" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

export default VoucherList;
