import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


function Edit_Address({ address, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    Username: '',
    PhoneNumber: '',
    Address: '',
    DistrictID: '',
    WardCode: '',
    ProvinceID: '',
    isDefault: false
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (address) {
      setFormData({
        UserName: address.Username || '',
        PhoneNumber: address.PhoneNumber,
        Address: address.Address,
        DistrictID: address.DistrictID,
        WardCode: address.WardCode,
        ProvinceID: address.ProvinceID,
        isDefault: address.IsDefault === 1
      });
    } else {
      setFormData({
        UserName: '',
        PhoneNumber: '',
        Address: '',
        DistrictID: '',
        WardCode: '',
        ProvinceID: '',
        isDefault: false
      });
    }
  }, [address]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/provinces');
        if (response.data.message === 'Success') {
          setProvinces(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
        toast.error('Không thể tải danh sách tỉnh thành.');
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async (provinceID) => {
      try {
        const response = await axios.post(`http://127.0.0.1:8000/api/districts`, {
          province_id: provinceID
        });
        if (response.data.message === 'Success') {
          setDistricts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
        toast.error('Không thể tải danh sách quận huyện.');
      }
    };

    if (formData.ProvinceID) {
      fetchDistricts(formData.ProvinceID);
    }
  }, [formData.ProvinceID]);

  useEffect(() => {
    const fetchWards = async (districtID) => {
      try {
        const response = await axios.post(`http://127.0.0.1:8000/api/wards`, {
          district_id: districtID
        });
        if (response.data.message === 'Success') {
          setWards(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching wards:', error);
        toast.error('Không thể tải danh sách phường xã.');
      }
    };

    if (formData.DistrictID) {
      fetchWards(formData.DistrictID);
    }
  }, [formData.DistrictID]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldMapping = {
      'fullName': 'UserName',
      'phoneNumber': 'PhoneNumber',
      'address': 'Address',
      'districtID': 'DistrictID',
      'wardCode': 'WardCode',
      'isDefault': 'isDefault',
      'provinceID': 'ProvinceID'
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
      toast.error('Vui lòng điền đầy đủ thông tin!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const dataToSend = {
      UserID: address.UserID,
      UserName: formData.UserName,
      PhoneNumber: formData.PhoneNumber,
      Address: formData.Address,
      ProvinceID: formData.ProvinceID,
      DistrictID: formData.DistrictID,
      WardCode: formData.WardCode,
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
        toast.success('Cập nhật địa chỉ thành công!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onCancel();
        onSuccess();
      }
    } catch (error) {
      console.error('Lỗi chi tiết:', error.response?.data);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật địa chỉ. Vui lòng thử lại!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `http://127.0.0.1:8000/api/address/${addressId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status === 200) {
          toast.success('Xóa địa chỉ thành công!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          
          onSuccess();
          onCancel();
        }
      }
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ:', error);
      
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa địa chỉ!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="border p-4 rounded bg-light mt-5">
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
          <label className="form-label">Chọn tỉnh thành</label>
          <select
            className="form-control"
            name="provinceID"
            value={formData.ProvinceID}
            onChange={handleChange}
            required
          >
            <option value="">Chọn tỉnh thành</option>
            {provinces.map(province => (
              <option key={province.ProvinceID} value={province.ProvinceID}>
                {province.ProvinceName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Chọn huyện</label>
          <select
            className="form-control"
            name="districtID"
            value={formData.DistrictID}
            onChange={handleChange}
            required
          >
            <option value="">Chọn huyện</option>
            {districts.map(district => (
              <option key={district.DistrictID} value={district.DistrictID}>
                {district.DistrictName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Chọn xã</label>
          <select
            className="form-control"
            name="wardCode"
            value={formData.WardCode}
            onChange={handleChange}
            required
          >
            <option value="">Chọn xã</option>
            {wards.map(ward => (
              <option key={ward.WardCode} value={ward.WardCode}>
                {ward.WardName}
              </option>
            ))}
          </select>
        </div>

        
        <div className="mb-3">
          <label className="form-label">Địa chỉ cụ thể</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={formData.Address}
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
    Username: PropTypes.string,
    PhoneNumber: PropTypes.string.isRequired,
    Address: PropTypes.string.isRequired,
    ProvinceID: PropTypes.string.isRequired,
    DistrictID: PropTypes.string.isRequired,
    WardCode: PropTypes.string.isRequired,
    IsDefault: PropTypes.number.isRequired
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Edit_Address;
