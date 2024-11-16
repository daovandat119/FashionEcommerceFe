import React, { useEffect, useState } from "react";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetCoupons,
  UpdateVouchers,
  GetCouponDetails,
} from "../service/api_service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateVoucher = () => {
  const { VoucherID } = useParams();
  const navigate = useNavigate();
  const [voucherData, setVoucherData] = useState({
    Name: "",
    Code: "",
    DiscountPercentage: "",
    MinimumOrderValue: "",
    UsageLimit: "",
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
      localStorage.setItem(
        "successMessage",
        "Voucher đã được cập nhật thành công!"
      );
      navigate("/admin/vouchers");
    } catch (error) {
      console.error("Lỗi khi cập nhật voucher:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Lỗi khi cập nhật voucher. Vui lòng thử lại.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleBackToList = () => {
    navigate("/admin/vouchers");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <Typography variant="h5" className="text-2xl font-bold mb-6 text-center">
        Update Voucher
      </Typography>
      <Card className="p-6 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <Input
            label="Voucher Name"
            name="Name"
            value={voucherData.Name}
            onChange={handleChange}
            required
          />
          <Input
            label="Voucher Code"
            name="Code"
            value={voucherData.Code}
            onChange={handleChange}
            required
          />
          <Input
            label="Discount Percentage"
            name="DiscountPercentage"
            type="number"
            value={voucherData.DiscountPercentage}
            onChange={handleChange}
            required
          />
          <Input
            label="Minimum Order Value"
            name="MinimumOrderValue"
            type="number"
            value={voucherData.MinimumOrderValue}
            onChange={handleChange}
            required
          />
          <Input
            label="Usage Limit"
            name="UsageLimit"
            type="number"
            value={voucherData.UsageLimit}
            onChange={handleChange}
            required
          />
          <Input
            label="Expiration Date and Time"
            name="ExpiresAt"
            type="datetime-local"
            value={voucherData.ExpiresAt.substring(0, 16)}
            onChange={handleChange}
            required
          />
          <Button type="submit" color="green" className="w-full">
            Update Voucher
          </Button>
          <Button
            type="button"
            color="blue"
            className="w-full mt-4"
            onClick={handleBackToList}
          >
            List Voucher
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default UpdateVoucher;
