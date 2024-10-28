import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EditAddress() {
  const [addresses, setAddresses] = useState([]); // Khởi tạo state cho địa chỉ
  const [loading, setLoading] = useState(true); // Khởi tạo state cho loading
  const [error, setError] = useState(null); // Khởi tạo state cho lỗi
  const token = localStorage.getItem('token'); // Lấy token từ local storage

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/address`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log("Dữ liệu từ API:", response.data); // Kiểm tra dữ liệu
        setAddresses(response.data.data || []); // Lấy dữ liệu từ thuộc tính "data"
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token]);

  if (loading) return <p>Loading...</p>; // Hiển thị loading nếu đang tải dữ liệu
  if (error) return <p>Error: {error}</p>; // Hiển thị lỗi nếu có

  return (
    <div className="col-lg-9">
      <div className="page-content my-account__address">
        <p className="notice">
          The following addresses will be used on the checkout page by default.
        </p>
        <div className="my-account__address-list">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address.AddressID} className="my-account__address-item">
                <div className="my-account__address-item__title">
                  <h5>{address.Username}</h5>
                  <a href="#">Edit</a>
                </div>
                <div className="my-account__address-item__detail">
                  <p>{address.Address}</p>
                  <p>Phone: {address.PhoneNumber}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No addresses found. Please add a new address.</p>
          )}
        </div>
      </div>
    </div>
  );
}
