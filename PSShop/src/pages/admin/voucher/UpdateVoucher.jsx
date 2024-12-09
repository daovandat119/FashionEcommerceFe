import React, { useEffect, useState } from "react";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetCoupons,
  UpdateVouchers,
  GetCouponDetails,
} from "../service/api_service";
import Swal from "sweetalert2"; // Import SweetAlert

const UpdateVoucher = () => {
  const { VoucherID } = useParams();
  const navigate = useNavigate();
  const [voucherData, setVoucherData] = useState({
    Name: "",
    Code: "",
    DiscountPercentage: "",
    MinimumOrderValue: "",
    UsageLimit: "",
    MaxAmount: "",
    ExpiresAt: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVoucherDetails = async () => {
      try {
        const response = await GetCouponDetails(VoucherID);
        if (response.data && response.data.CouponID) {
          const voucher = response.data;
          setVoucherData({
            Name: voucher.Name,
            Code: voucher.Code,
            DiscountPercentage: voucher.DiscountPercentage,
            MinimumOrderValue: voucher.MinimumOrderValue,
            UsageLimit: voucher.UsageLimit,
            MaxAmount: voucher.MaxAmount,
            ExpiresAt: voucher.ExpiresAt,
          });
        }
      } catch (error) {
        console.error("Error fetching voucher details:", error);
      }
    };

    fetchVoucherDetails();
  }, [VoucherID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucherData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await UpdateVouchers(VoucherID, voucherData);
      Swal.fire(
        "Thành công!",
        "Voucher đã được cập nhật thành công!",
        "success"
      );
      navigate("/admin/vouchers");
    } catch (error) {
      console.error("Lỗi khi cập nhật voucher:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Lỗi khi cập nhật voucher. Vui lòng thử lại.";
      setError(errorMessage);
      Swal.fire("Lỗi!", errorMessage, "error");
    }
  };

  const handleBackToList = () => {
    navigate("/admin/vouchers");
  };

  return (
    <div className="container  px-4 py-8 w-full">
      <Typography variant="h5" className="text-2xl font-bold mb-6 text-left">
        Cập nhật mã giảm giá
      </Typography>
      <Card className="p-6  mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {error && <div className="text-red-500">{error}</div>}
          <div className="mb-4 col-span-2">
            <Input
              label="Tên mã giảm giá"
              name="Name"
              value={voucherData.Name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 col-span-2">
            <Input
              label="Mã giảm giá"
              name="Code"
              value={voucherData.Code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Phần trăm giảm giá"
              name="DiscountPercentage"
              type="number"
              value={voucherData.DiscountPercentage}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Đơn tối thiểu"
              name="MinimumOrderValue"
              type="number"
              value={voucherData.MinimumOrderValue}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Giá trị tối đa"
              name="UsageLimit"
              type="number"
              value={voucherData.UsageLimit}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Giá trị tối đa"
              name="MaxAmount"
              type="number"
              value={voucherData.MaxAmount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Ngày hết hạn"
              name="ExpiresAt"
              type="datetime-local"
              value={voucherData.ExpiresAt.substring(0, 16)}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-4 w-full col-span-2">
            <button
              type="submit"
              className="w-[15%] bg-green-500 text-white py-3 px-4 rounded-xl shadow-md hover:bg-green-600 transition transform hover:scale-105"
            >
              Cập nhật mã giảm giá
            </button>
            <button
              type="button"
              className="w-[15%] bg-blue-500 text-white py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition transform hover:scale-105"
              onClick={handleBackToList}
            >
              Quay lại mã giảm giá
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UpdateVoucher;
