import React, { useEffect, useState } from "react";
import {
  GetAddressByUserId,
  GetProvinces,
  GetDistricts,
  GetWards,
  UpdateAddress,
} from "../service/api_service";
import { Link } from "react-router-dom";
import UpdateProfileAdmin from "./UpdateProfileAdmin";
import { FaSpinner } from "react-icons/fa";

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
    const fetchData = async () => {
      setLoading(true);
      try {
        const addressResponse = await GetAddressByUserId();
        const provincesResponse = await GetProvinces();

        setAddress(addressResponse.data[0]);
        setProvinces(provincesResponse.data);

        if (addressResponse.data[0]) {
          setSelectedProvince(addressResponse.data[0].ProvinceID);
          setSelectedDistrict(addressResponse.data[0].DistrictID);
          setSelectedWard(addressResponse.data[0].WardCode);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
        <span className="ml-4 text-lg">Đang tải thông tin địa chỉ, vui lòng chờ...</span>
      </div>
    );
  }

  const provinceName =
    provinces.find((province) => province.ProvinceID == selectedProvince)
      ?.ProvinceName || "Không xác định";
  const districtName =
    districts.find((district) => district.DistrictID == selectedDistrict)
      ?.DistrictName || "Không xác định";
  const wardName =
    wards.find((ward) => ward.WardCode === selectedWard)?.WardName ||
    "Không xác định";

  return (
    <div className="flex justify-center items-center h-screen w-[95%] mx-auto bg-gray-100">
      <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-left text-gray-800 mb-6">
          Profile Admin
        </h1>
        {address ? (
          isEditing ? (
            <UpdateProfileAdmin
              address={address}
              setAddress={setAddress}
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedWard={selectedWard}
              setSelectedWard={setSelectedWard}
              provinces={provinces}
              districts={districts}
              wards={wards}
              handleSubmit={handleSubmit}
              setIsEditing={setIsEditing}
            />
          ) : (
            <div className="space-y-4">
              {/* Row 1: Name and Phone Number */}
              <div className="flex justify-between">
                <div className="flex-1 mr-2">
                  <label className="font-medium">Họ và tên:</label>
                  <input
                    type="text"
                    value={address.Username}
                    readOnly
                    className="border border-gray-300 rounded-md p-2 mt-1 w-full"
                  />
                </div>
                <div className="flex-1 ml-2">
                  <label className="font-medium">Số điện thoại:</label>
                  <input
                    type="text"
                    value={address.PhoneNumber}
                    readOnly
                    className="border border-gray-300 rounded-md p-2 mt-1 w-full"
                  />
                </div>
              </div>
              {/* Row 2: Province and District */}
              <div className="flex justify-between">
                <div className="flex-1 mr-2">
                  <label className="font-medium">Tỉnh/Thành phố:</label>
                  <input
                    type="text"
                    value={provinceName}
                    readOnly
                    className="border border-gray-300 rounded-md p-2 mt-1 w-full"
                  />
                </div>
                <div className="flex-1 ml-2">
                  <label className="font-medium">Quận/Huyện:</label>
                  <input
                    type="text"
                    value={districtName}
                    readOnly
                    className="border border-gray-300 rounded-md p-2 mt-1 w-full"
                  />
                </div>
              </div>
              {/* Row 3: Ward and Address */}
              <div className="flex justify-between">
                <div className="flex-1 mr-2">
                  <label className="font-medium">Phường/Xã:</label>
                  <input
                    type="text"
                    value={wardName}
                    readOnly
                    className="border border-gray-300 rounded-md p-2 mt-1 w-full"
                  />
                </div>
                <div className="flex-1 ml-2">
                  <label className="font-medium">Tên đường/Số nhà:</label>
                  <input
                    type="text"
                    value={address.Address}
                    readOnly
                    className="border border-gray-300 rounded-md p-2 mt-1 w-full"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 w-[15%] py-3"
                >
                  Chỉnh sửa
                </button>
                <Link
                  to="/admin"
                  className="bg-gray-500 text-white font-bold rounded-2xl hover:bg-gray-600 text-center block w-[15%] py-3"
                >
                  Quay lại
                </Link>
              </div>
            </div>
          )
        ) : (
          <p className="text-red-500 text-center mt-4">
            Không có thông tin địa chỉ.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileAdmin;
