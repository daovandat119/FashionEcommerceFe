import PropTypes from 'prop-types';
import  { useState } from 'react';
import axios from 'axios';

function Add_Address({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    Username: '',
    PhoneNumber: '',
    Address: '',
    isDefault: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldMapping = {
      'fullName': 'Username',
      'phoneNumber': 'PhoneNumber',
      'address': 'Address',
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
    const token = localStorage.getItem('token');
    
    if (!formData.Username || !formData.PhoneNumber || !formData.Address) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const dataToSend = {
      UserName: formData.Username,
      PhoneNumber: formData.PhoneNumber,
      Address: formData.Address,
      isDefault: formData.isDefault ? 1 : 0
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

      console.log('Response:', response);
      
      if (response.status === 200 || response.status === 201) {
        alert('Thêm địa chỉ thành công!');
        onSuccess();
      }
    } catch (error) {
      console.error('Lỗi chi tiết:', error.response?.data);
      alert('Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại!');
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
              value={formData.Username}
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
