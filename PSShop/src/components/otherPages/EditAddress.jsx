import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Add_Address from './Add_Address';
import Edit_Address from './Edit_Address';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function EditAddress() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [expandedAddressId, setExpandedAddressId] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/address`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setAddresses(response.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSetDefaultAddress = async (addressId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/address/setDefaultAddress/${addressId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Thông báo",
          text: "Địa chỉ đã được đặt làm mặc định thành công!",
          icon: "success",
          showConfirmButton: true,
          timer: 5000,
        });
        fetchAddresses(); // Cập nhật danh sách địa chỉ
      }
    } catch (error) {
      console.error('Lỗi khi đặt địa chỉ mặc định:', error.response?.data);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt địa chỉ mặc định.');
    }
  };

  const toggleExpandAddress = (addressId) => {
    setExpandedAddressId(expandedAddressId === addressId ? null : addressId);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="col-lg-9">
      <div className="page-content my-account__address">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="notice mb-0">
            The following addresses will be used on the checkout page by default.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Thêm địa chỉ mới
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4">
            <Add_Address onSuccess={() => {
              setShowAddForm(false);
              fetchAddresses();
            }} 
            onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        <div className="my-account__address-list flex flex-col">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address.AddressID} className={`my-account__address-item p-4 rounded-lg shadow-md transition-transform duration-200 ${address.IsDefault == 1 ? 'border-2 border-gray-600 bg-blue-50' : 'border border-gray-200'}`}>
                <div className="my-account__address-item__title flex justify-between items-center">
                  <h5 className={`text-lg font-semibold ${address.IsDefault ? 'text-gray-600' : 'text-gray-800'}`}>{address.UserName}</h5>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-warning btn-sm rounded-lg shadow hover:bg-yellow-500 transition duration-200"
                      onClick={() => toggleExpandAddress(address.AddressID)}
                    >
                      Sửa
                    </button>
                    <button 
                      className="btn btn-success btn-sm rounded-lg shadow hover:bg-green-500 transition duration-200"
                      onClick={() => handleSetDefaultAddress(address.AddressID)}
                    >
                      Đặt làm mặc định
                    </button>
                  </div>
                </div>
                <div className="my-account__address-item__detail mt-2">
                  <p className="text-gray-700">{address.Address}</p>
                  <p className="text-gray-600">Phone: {address.PhoneNumber}</p>
                  {address.IsDefault == 1 && (
                    <span className="inline-block bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full mt-2">Địa chỉ mặc định</span>
                  )}
                </div>
                {expandedAddressId === address.AddressID && (
                  <div className="expanded-content mt-2">
                    <Edit_Address address={address} onSuccess={() => {
                      toggleExpandAddress(null);
                      fetchAddresses();
                    }} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No addresses found. Please add a new address.</p>
          )}
        </div>

        {editingAddress && (
          <Edit_Address
            address={editingAddress}
            onSuccess={() => {
              setEditingAddress(null);
              fetchAddresses();
            }}
            onCancel={() => setEditingAddress(null)}
          />
        )}
      </div>
    </div>
  );
}
