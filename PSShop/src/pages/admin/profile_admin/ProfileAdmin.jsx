import React, { useEffect, useState } from "react";
import {
  GetAddressByUserId,
  GetProvinces,
  GetDistricts,
  GetWards,
  UpdateAddress,
  GetUserById,
} from "../service/api_service";
import { Link } from "react-router-dom";
import UpdateProfileAdmin from "./UpdateProfileAdmin";
import MyAdminProfile from "./AdminPR";
import { FaSpinner } from "react-icons/fa";

const Loading = () => (
  <div className="flex justify-center items-center h-full">
    <FaSpinner className="animate-spin text-3xl" />
    <span className="ml-4 text-lg">Đang tải dữ liệu, vui lòng chờ...</span>
  </div>
);

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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const addressResponse = await GetAddressByUserId();
        const provincesResponse = await GetProvinces();

        console.log(addressResponse.data[0]);
        setAddress(addressResponse.data[0]);
        setProvinces(provincesResponse.data);

        if (addressResponse.data[0]) {
          setSelectedProvince(addressResponse.data[0].ProvinceID);
          setSelectedDistrict(addressResponse.data[0].DistrictID);
          setSelectedWard(addressResponse.data[0].WardCode);
        }
      } catch (error) {
        console.error("Error fetching address or provinces:", error);
      } finally {
        setLoading(false);
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

  return (
    <div className="flex justify-center items-center h-screen w-[100%] mx-auto bg-gray-100 relative">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex justify-center w-[100%] gap-4">
          <div className="w-[45%] p-6 bg-white rounded-lg shadow-lg">
            <MyAdminProfile />
          </div>
          <div className="w-[45%] p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-center py-5 text-gray-800 mb-10">
              Địa chỉ liên hệ
            </h1>
            {address ? (
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
                    <label className="font-medium"> Tỉnh/Thành phố</label>
                    <input
                      type="text"
                      value={
                        provinces.find(
                          (province) => province.ProvinceID == selectedProvince
                        )?.ProvinceName || "Không xác định"
                      }
                      readOnly
                      className="border border-gray-300 rounded-md p-2 mt-1 w-full"
                    />
                  </div>
                </div>
                {/* Row 2: Province and District */}
                <div className="flex justify-between">
                  <div className="flex-1 mr-2">
                    <label className="font-medium">Số điện thoại:</label>
                    <input
                      type="text"
                      value={address.PhoneNumber}
                      readOnly
                      className="border border-gray-300 rounded-md p-2 mt-1 w-full"
                    />
                  </div>
                  <div className="flex-1 ml-2">
                    <label className="font-medium">Quận/Huyện:</label>
                    <input
                      type="text"
                      value={
                        districts.find(
                          (district) => district.DistrictID == selectedDistrict
                        )?.DistrictName || "Không xác định"
                      }
                      readOnly
                      className="border border-gray-300 rounded-md p-2 mt-1 w-full"
                    />
                  </div>
                </div>
                {/* Row 3: Ward and Address */}
                <div className="flex justify-between">
                  <div className="flex-1 mr-2">
                    <label className="font-medium">Phường/Xã: </label>
                    <input
                      type="text"
                      value={
                        wards.find((ward) => ward.WardCode === selectedWard)
                          ?.WardName || "Không xác định"
                      }
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
                {/* Row 4: Edit Button */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 w-[20%] py-3 my-4"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-red-500 text-center mt-4">
                Không có thông tin địa chỉ.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal for editing */}
      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-100 z-50">
          <div className="w-[45%]">
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
              handleSubmit={() => {
                // Handle submit logic here
                setIsEditing(false);
              }}
              setIsEditing={setIsEditing}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAdmin;
