import React, { useEffect, useState } from "react";
import {
  GetProvinces,
  GetDistricts,
  GetWards,
  UpdateAddress,
} from "../service/api_service";

const UpdateProfileAdmin = ({ address, setAddress, setIsEditing }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(address.ProvinceID);
  const [selectedDistrict, setSelectedDistrict] = useState(address.DistrictID);
  const [selectedWard, setSelectedWard] = useState(address.WardCode);

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await GetProvinces();
      if (response.message === "Success") {
        setProvinces(response.data);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        const response = await GetDistricts(selectedProvince);
        setDistricts(response.data);
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        const response = await GetWards(selectedDistrict);
        setWards(response.data);
      }
    };

    fetchWards();
  }, [selectedDistrict]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      UserID: address.UserID,
      UserName: address.Username,
      Address: address.Address,
      PhoneNumber: address.PhoneNumber,
      ProvinceID: selectedProvince,
      DistrictID: selectedDistrict,
      WardCode: selectedWard,
      IsDefault: address.IsDefault !== undefined ? address.IsDefault : 1,
    };

    try {
      await UpdateAddress(address.AddressID, dataToSubmit);
      alert("Cập nhật địa chỉ thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Cập nhật địa chỉ thất bại!");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg ">
      <h2 className="text-xl font-bold ">Cập nhật thông tin</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex-1 mr-2">
              <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input
                type="text"
                value={address.Username}
                onChange={(e) => setAddress({ ...address, Username: e.target.value })}
                className="block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex-1 ml-2">
              <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <input
                type="text"
                value={address.PhoneNumber}
                onChange={(e) => setAddress({ ...address, PhoneNumber: e.target.value })}
                className="block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex-1 mr-2">
              <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedDistrict("");
                  setSelectedWard("");
                }}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Chọn tỉnh</option>
                {provinces.map((province) => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 ml-2">
              <label className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedWard("");
                }}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Chọn huyện</option>
                {districts.map((district) => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex-1 mr-2">
              <label className="block text-sm font-medium text-gray-700">Phường/Xã</label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Chọn xã</option>
                {wards.map((ward) => (
                  <option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 ml-2">
              <label className="block text-sm font-medium text-gray-700">Địa chỉ cụ thể</label>
              <input
                type="text"
                value={address.Address}
                onChange={(e) => setAddress({ ...address, Address: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
   
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="submit"
            className="w-[15%] bg-blue-500 text-white font-bold py-2  rounded-md hover:bg-blue-600"
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="w-[15%] bg-gray-500 text-white font-bold py-2 rounded-md hover:bg-gray-600 "
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileAdmin;
