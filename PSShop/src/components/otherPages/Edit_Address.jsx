import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Edit_Address({ address, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    UserName: '',
    PhoneNumber: '',
    Address: '',
    DistrictID: '',
    WardCode: '',
    isDefault: false
  });

  useEffect(() => {
    if (address) {
      setFormData({
        UserName: address.UserName,
        PhoneNumber: address.PhoneNumber,
        Address: address.Address,
        DistrictID: address.DistrictID,
        WardCode: address.WardCode,
        isDefault: address.IsDefault === 1
      });
    } else {
      setFormData({
        UserName: '',
        PhoneNumber: '',
        Address: '',
        DistrictID: '',
        WardCode: '',
        isDefault: false
      });
    }
  }, [address]);

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
    const token = localStorage.getItem('token');

    if (!formData.UserName || !formData.PhoneNumber || !formData.Address || !formData.DistrictID || !formData.WardCode) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const dataToSend = {
      UserID: address.UserID,
      UserName: formData.UserName,
      PhoneNumber: formData.PhoneNumber,
      Address: formData.Address,
      DistrictID: formData.DistrictID,
      WardCode: formData.WardCode,
      IsDefault: formData.isDefault ? 1 : 0
    };

    // console.log("Data to send:", dataToSend);

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

  const handleDeleteAddress = async (addressId) => {
    const token = localStorage.getItem('token');
    if (formData.isDefault) {
      alert('Vui lòng chuyển địa chỉ mặc định sang địa chỉ khác trước khi xóa!');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/address/${addressId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          toast.success('Địa chỉ đã được xóa thành công!');
          onSuccess();
        }
      } catch (error) {
        console.error('Lỗi khi xóa địa chỉ:', error.response?.data);
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa địa chỉ.');
      }
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
              name="fullName"
              value={formData.UserName || ''}
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
          <label className="form-label">Mã quận</label>
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
          <label className="form-label">Mã phường</label>
          <input
            type="text"
            className="form-control"
            name="wardCode"
            value={formData.WardCode}
            onChange={handleChange}
            required
          />
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
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={() => handleDeleteAddress(address.AddressID)}
          >
            Xóa địa chỉ
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
    UserName: PropTypes.string.isRequired,
    PhoneNumber: PropTypes.string.isRequired,
    Address: PropTypes.string.isRequired,
    DistrictID: PropTypes.string.isRequired,
    WardCode: PropTypes.string.isRequired,
    IsDefault: PropTypes.number.isRequired
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Edit_Address;
