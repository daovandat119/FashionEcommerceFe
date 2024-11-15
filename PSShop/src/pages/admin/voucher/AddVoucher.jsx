import React, { useState } from 'react';
import { Card, Button, Input, Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import { AddVouchers } from '../service/api_service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddVoucher = () => {
  const [voucherDetails, setVoucherDetails] = useState({
    Name: '',
    Code: '',
    DiscountPercentage: '',
    MinimumOrderValue: '',
    UsageLimit: '',
    ExpiresAt: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucherDetails({ ...voucherDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra dữ liệu đầu vào
    if (!voucherDetails.Name || !voucherDetails.Code || !voucherDetails.DiscountPercentage || !voucherDetails.MinimumOrderValue || !voucherDetails.UsageLimit || !voucherDetails.ExpiresAt) {
      setError('Vui lòng điền tất cả các trường.');
      return;
    }

    try {
      await AddVouchers(voucherDetails);
      localStorage.setItem('successMessage', 'Voucher đã được thêm thành công!');
      navigate('/admin/vouchers');
    } catch (error) {
      console.error('Lỗi khi thêm voucher:', error);
      
      // Kiểm tra xem có thông báo lỗi từ API không
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.errors?.Code ? error.response.data.errors.Code[0] : 'Lỗi khi thêm voucher. Vui lòng thử lại.';
        setError(errorMessage); // Cập nhật thông báo lỗi
        toast.error(errorMessage); // Hiển thị thông báo lỗi
      } else {
        setError('Lỗi khi thêm voucher. Vui lòng thử lại.'); // Thông báo lỗi mặc định
        toast.error('Lỗi khi thêm voucher. Vui lòng thử lại.'); // Hiển thị thông báo lỗi mặc định
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <Typography variant="h5" className="text-2xl font-bold mb-6 text-center">
        Add New Voucher
      </Typography>
      <Card className="p-6 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <Input
            label="Voucher Name"
            name="Name"
            value={voucherDetails.Name}
            onChange={handleChange}
          />
          <Input
            label="Code"
            name="Code"
            value={voucherDetails.Code}
            onChange={handleChange}
          />
          <Input
            label="Discount Percentage"
            name="DiscountPercentage"
            type="number"
            value={voucherDetails.DiscountPercentage}
            onChange={handleChange}
            min="0"
          />
          <Input
            label="Minimum Order Value"
            name="MinimumOrderValue"
            type="number"
            value={voucherDetails.MinimumOrderValue}
            onChange={handleChange}
            min="0"
          />
          <Input
            label="Usage Limit"
            name="UsageLimit"
            type="number"
            value={voucherDetails.UsageLimit}
            onChange={handleChange}
            min="0"
          />
          <Input
            label="Expiration Date and Time"
            name="ExpiresAt"
            type="datetime-local"
            value={voucherDetails.ExpiresAt}
            onChange={handleChange}
          />
          <Button type="submit" color="green" className="w-full">
            Add Voucher
          </Button>
          <Button 
            type="button" 
            color="blue" 
            className="w-full mt-4" 
            onClick={() => navigate('/admin/vouchers')}
          >
            List Voucher
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddVoucher;