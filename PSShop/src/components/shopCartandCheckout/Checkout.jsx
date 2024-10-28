import { useEffect, useState } from "react";
import axios from "axios";

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);

  const token = localStorage.getItem("token"); // Lấy token

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/address", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAddresses(response.data.data); // Set dữ liệu địa chỉ
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    fetchAddresses();
  }, [token]);

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/address",
        {
          UserName: fullName,
          Address: address,
          PhoneNumber: phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Đã thêm địa chỉ thành công!");
      setErrorMessage("");
      setFullName("");
      setAddress("");
      setPhone("");
    } catch (error) {
      setErrorMessage("Thêm địa chỉ không thành công.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="p-6 bg-w min-h-screen">
      <h2 className="text-3xl font-bold mb-4"> Choose your Address</h2>

      {/* Display Address Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <div
              key={addr.AddressID}
              className={`p-4 bg-white rounded-lg shadow-md cursor-pointer transition-transform transform ${
                selectedAddress === addr.AddressID ? "border-2 border-blue-500" : "hover:scale-105"
              }`}
              onClick={() => setSelectedAddress(addr.AddressID)}
            >
              <h3 className="font-semibold">{addr.Username}</h3>
              <p>{addr.Address}</p>
              <p>{addr.PhoneNumber}</p>
            </div>
          ))
        ) : (
          <p className="text-red-500">Không có địa chỉ nào.</p>
        )}
      </div>

      {/* Form to Add New Address */}
      <h4 className="text-lg font-semibold mb-2">Add new address</h4>
      <form onSubmit={handleAddAddress} className="bg-white p-4 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Họ và tên:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Nhập họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Địa chỉ:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Nhập địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Số điện thoại:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}

        <button type="submit" className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-950">
          Thêm địa chỉ
        </button>
      </form>
    </div>
  );
}
