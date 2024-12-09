import React, { useState } from "react";
import { Card, Button, Input, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { AddVouchers } from "../service/api_service";
import Swal from "sweetalert2";

const AddVoucher = () => {
  const [voucherDetails, setVoucherDetails] = useState({
    Name: "",
    Code: "",
    DiscountPercentage: "",
    MinimumOrderValue: "",
    UsageLimit: "",
    MaxAmount: "",
    ExpiresAt: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucherDetails({ ...voucherDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra dữ liệu đầu vào
    if (
      !voucherDetails.Name ||
      !voucherDetails.Code ||
      !voucherDetails.DiscountPercentage ||
      !voucherDetails.MinimumOrderValue ||
      !voucherDetails.MaxAmount ||
      !voucherDetails.ExpiresAt
    ) {
      setError("Vui lòng điền tất cả các trường.");
      return;
    }

    try {
      await AddVouchers(voucherDetails);
      Swal.fire("Thành công!", "Voucher đã được thêm thành công!", "success");
      navigate("/admin/vouchers");
    } catch (error) {
      console.error("Lỗi khi thêm voucher:", error);
      const errorMessage = error.response?.data?.errors?.Code
        ? error.response.data.errors.Code[0]
        : "Lỗi khi thêm voucher. Vui lòng thử lại.";
      setError(errorMessage);
      Swal.fire("Lỗi!", errorMessage, "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h5" className="text-2xl font-bold mb-6 text-center">
        Tạo mã giảm giá
      </Typography>
      <Card className="p-6 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <Input
            label="Tên mã giảm giá"
            name="Name"
            value={voucherDetails.Name}
            onChange={handleChange}
          />
          <Input
            label="Mã giảm giá"
            name="Code"
            value={voucherDetails.Code}
            onChange={handleChange}
          />
          <Input
            label="Phần trăm giảm giá"
            name="DiscountPercentage"
            type="number"
            value={voucherDetails.DiscountPercentage}
            onChange={handleChange}
            min="0"
          />
          <Input
            label="Đơn tối thiểu"
            name="MinimumOrderValue"
            type="number"
            value={voucherDetails.MinimumOrderValue}
            onChange={handleChange}
            min="0"
          />
          <Input
            label="Giá trị tối đa"
            name="UsageLimit"
            type="number"
            value={voucherDetails.UsageLimit}
            onChange={handleChange}
            min="0"
          />
          <Input
            label="Giá trị tối đa"
            name="MaxAmount"
            type="number"
            value={voucherDetails.MaxAmount}
            onChange={handleChange}
            min="0"
          />
          <Input
            label="Ngày hết hạn"
            name="ExpiresAt"
            type="datetime-local"
            value={voucherDetails.ExpiresAt}
            onChange={handleChange}
          />
          <Button type="submit" color="green" className="w-full">
            Tạo mã giảm giá
          </Button>
          <Button
            type="button"
            color="blue"
            className="w-full mt-4"
            onClick={() => navigate("/admin/vouchers")}
          >
            Quay lại mã giảm giá
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddVoucher;
