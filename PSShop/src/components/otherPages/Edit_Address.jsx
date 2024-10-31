import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Edit_Address({ address, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    Username: '',
    PhoneNumber: '',
    Address: '',
    isDefault: false
  });

  useEffect(() => {
    if (address) {
      setFormData({
        Username: address.Username,
        PhoneNumber: address.PhoneNumber,
        Address: address.Address,
        isDefault: address.IsDefault === 1
      });
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Address prop:', address);
    
    const token = localStorage.getItem('token');
    
    if (!formData.Username || !formData.PhoneNumber || !formData.Address) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const dataToSend = {
      UserID: address.UserID,
      UserName: formData.Username,
      PhoneNumber: formData.PhoneNumber,
      Address: formData.Address,
      IsDefault: formData.isDefault ? 1 : 0
    };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/address/${address.AddressID}`, 
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
       toast.success('Cập nhật địa chỉ thành công!');
        onSuccess();
      }
    } catch (error) {
      console.error('Lỗi chi tiết:', error.response?.data);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật địa chỉ. Vui lòng thử lại!');
    }
  };

  return (
    <div className="border p-4 rounded bg-light">
      <h4 className="mb-4">Sửa Địa Chỉ</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              name="Username"
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
              name="PhoneNumber"
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
            name="Address"
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
              Đặt làm địa chỉ mặc định ({formData.isDefault ? '1' : '0'})
            </label>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Lưu thay đổi
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

Edit_Address.propTypes = {
  address: PropTypes.shape({
    AddressID: PropTypes.number.isRequired,
    UserID: PropTypes.number.isRequired,
    Username: PropTypes.string.isRequired,
    PhoneNumber: PropTypes.string.isRequired,
    Address: PropTypes.string.isRequired,
    IsDefault: PropTypes.number.isRequired
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Edit_Address;
