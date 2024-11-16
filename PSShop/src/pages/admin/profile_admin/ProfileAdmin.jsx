import React, { useEffect, useState } from "react";
import {
  GetAddressByUserId,
  GetProvinces,
  GetDistricts,
  GetWards,
  UpdateAddress,
} from "../service/api_service";
import { Link } from "react-router-dom";

const ProfileAdmin = () => {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await GetAddressByUserId();
        setAddress(response.data[0]);
        setSelectedProvince(response.data[0].DistrictID);
        setSelectedDistrict(response.data[0].DistrictID);
        setSelectedWard(response.data[0].WardCode);
        console.log(address);
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await GetProvinces();
        if (response.message === "Success") {
          setProvinces(response.data);
        } else {
          console.error("Failed to fetch provinces:", response.message);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      console.log(selectedProvince);
      if (selectedProvince) {
        try {
          const response = await GetDistricts(selectedProvince);
          setDistricts(response.data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        try {
          const response = await GetWards(selectedDistrict);
          setWards(response.data);
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const provinceName =
    provinces.find((province) => province.ProvinceID === selectedProvince)
      ?.ProvinceName || "Không xác định";
  const districtName =
    districts.find((district) => district.DistrictID === selectedDistrict)
      ?.DistrictName || "Không xác định";
  const wardName =
    wards.find((ward) => ward.WardCode === selectedWard)?.WardName ||
    "Không xác định";

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Profile Admin
        </h1>
        {address ? (
          isEditing ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={address.Username}
                    onChange={(e) =>
                      setAddress({ ...address, Username: e.target.value })
                    }
                    className=" block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={address.PhoneNumber}
                    onChange={(e) =>
                      setAddress({ ...address, PhoneNumber: e.target.value })
                    }
                    className=" block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tỉnh/Thành phố
                  </label>
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
                      <option
                        key={province.ProvinceID}
                        value={province.ProvinceID}
                      >
                        {province.ProvinceName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quận/Huyện
                  </label>
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
                      <option
                        key={district.DistrictID}
                        value={district.DistrictID}
                      >
                        {district.DistrictName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phường/Xã
                  </label>
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
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ cụ thể
                    </label>
                    <input
                      type="text"
                      value={address.Address}
                      onChange={(e) =>
                        setAddress({ ...address, Address: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={address.IsDefault === 1}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          IsDefault: e.target.checked ? 1 : 0,
                        })
                      }
                    />
                    <span className="ml-2">Đặt làm địa chỉ mặc định</span>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full bg-gray-500 text-white font-bold py-2 rounded-md hover:bg-gray-600"
              >
                Hủy
              </button>
            </form>
          ) : (
            <div className="space-y-4 flex flex-col gap-4">
             <div className="flex justify-between">
             <p>
                <strong>Họ và tên:</strong> {address.Username}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {address.PhoneNumber}
              </p>
             </div>
              <p>
                <strong>Tỉnh/Thành phố:</strong> {provinceName}
              </p>
              <p>
                <strong>Quận/Huyện:</strong> {districtName}
              </p>
              <p>
                <strong>Phường/Xã:</strong> {wardName}
              </p>
              <p>
                <strong>Tên đường/Số nhà:</strong> {address.Address}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600"
              >
                Chỉnh sửa
              </button>
            </div>
          )
        ) : (
          <p className="text-red-500 text-center mt-4">
            Không có thông tin địa chỉ.
          </p>
        )}
        <Link
          to="/admin"
          className="w-full bg-gray-500 text-white font-bold py-2 rounded-md hover:bg-gray-600 text-center block mt-4"
        >
          Quay lại
        </Link>
      </div>
    </div>
  );
};

export default ProfileAdmin;  