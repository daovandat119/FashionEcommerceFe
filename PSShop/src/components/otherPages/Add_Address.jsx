import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Add_Address({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    UserName: '',
    PhoneNumber: '',
    Address: '',
    DistrictID: '',
    WardCode: '',
    isDefault: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldMapping = {
      'fullName': 'UserName',
      'phoneNumber': 'PhoneNumber',
      'address': 'Address',
      'districtID': 'DistrictID',
      'wardCode': 'WardCode',
      'isDefault': 'isDefault'
    };

    const stateField = fieldMapping[name] || name;

    setFormData(prevState => ({
      ...prevState,
      [stateField]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.UserName || !formData.PhoneNumber || !formData.Address || !formData.DistrictID || !formData.WardCode) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const token = localStorage.getItem('token');
    const dataToSend = {
      UserID: localStorage.getItem('userId'), // Giả sử bạn lưu userId trong localStorage
      UserName: formData.UserName,
      PhoneNumber: formData.PhoneNumber,
      Address: formData.Address,
      DistrictID: formData.DistrictID,
      WardCode: formData.WardCode,
      IsDefault: formData.isDefault ? 1 : 0,
      Status: 'ACTIVE'
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/address',
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        toast.success('Thêm địa chỉ thành công!');
        onSuccess();
      }
    } catch (error) {
      console.error('Lỗi chi tiết:', error.response?.data);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại!');
    }
  };

  return (
    <div className="border p-4 rounded bg-light">
      <h4 className="mb-4">Thêm Địa Chỉ Mới</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={formData.UserName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Số điện thoại</label>
            <input
              type="tel"
              className="form-control"
              name="phoneNumber"
              value={formData.PhoneNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Chọn tỉnh thành</label>
          <input
            type="text"
            className="form-control"
            name="provinceID"
            value={formData.ProvinceID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Chọn quận huyện</label>
          <input
            type="text"
            className="form-control"
            name="districtID"
            value={formData.DistrictID}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Chọn phường xã</label>
          <input
            type="text"
            className="form-control"
            name="wardCode"
            value={formData.WardCode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Địa chỉ</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={formData.Address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="isDefault"
              id="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isDefault">
              Đặt làm địa chỉ mặc định
            </label>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Lưu địa chỉ
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

Add_Address.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Add_Address;
