import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

function Add_Address({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    UserName: "",
    PhoneNumber: "",
    Address: "",
    DistrictID: "",
    WardCode: "",
    isDefault: false,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/provinces");
        if (response.data.message === "Success") {
          setProvinces(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải danh sách tỉnh thành.",
        });
      }
    };

    fetchProvinces();
  }, []);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const fieldMapping = {
      fullName: "UserName",
      phoneNumber: "PhoneNumber",
      address: "Address",
      districtID: "DistrictID",
      wardCode: "WardCode",
      isDefault: "isDefault",
    };

    const stateField = fieldMapping[name] || name;

    if (name === "provinceID" && value) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/districts",
          {
            province_id: value,
          }
        );
        if (response.data.message === "Success") {
          setDistricts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải danh sách quận huyện.",
        });
      }
    }

    if (name === "districtID" && value) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/wards", {
          district_id: value,
        });
        if (response.data.message === "Success") {
          setWards(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching wards:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải danh sách xã phường.",
        });
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [stateField]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const dataToSend = {
      UserName: formData.UserName,
      PhoneNumber: formData.PhoneNumber,
      Address: formData.Address,
      DistrictID: formData.DistrictID,
      WardCode: formData.WardCode,
      ProvinceID: formData.provinceID,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/address",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Địa chỉ đã được thêm thành công!",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Lỗi chi tiết:", error.response?.data);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại!",
      });
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
          <select
            className="form-control"
            name="provinceID"
            value={formData.ProvinceID}
            onChange={handleChange}
            required
          >
            <option value="">Chọn tỉnh thành</option>
            {provinces.map((province) => (
              <option key={province.ProvinceID} value={province.ProvinceID}>
                {province.ProvinceName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Chọn quận huyện</label>
          <select
            className="form-control"
            name="districtID"
            value={formData.DistrictID}
            onChange={handleChange}
            required
          >
            <option value="">Chọn quận huyện</option>
            {districts.map((district) => (
              <option key={district.DistrictID} value={district.DistrictID}>
                {district.DistrictName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Chọn phường xã</label>
          <select
            className="form-control"
            name="wardCode"
            value={formData.WardCode}
            onChange={handleChange}
            required
          >
            <option value="">Chọn phường xã</option>
            {wards.map((ward) => (
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
  onCancel: PropTypes.func.isRequired,
};

export default Add_Address;
