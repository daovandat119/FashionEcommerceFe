import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Add_Address from './Add_Address';
import Edit_Address from './Edit_Address';
import Swal from 'sweetalert2';

export default function EditAddress() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [expandedAddressId, setExpandedAddressId] = useState(null);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

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
    if (isSettingDefault) return;
    setIsSettingDefault(true);
    
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

      if (response.data) {
        await fetchAddresses();

        Swal.fire({
          icon: 'success',
          title: 'Đã đặt làm địa chỉ mặc định',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Lỗi khi đặt địa chỉ mặc định:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Không thể đặt địa chỉ mặc định',
        text: 'Vui lòng thử lại sau.',
        showConfirmButton: true
      });
    } finally {
      setIsSettingDefault(false);
    }
  };

  const toggleExpandAddress = (addressId) => {
    setExpandedAddressId(addressId === expandedAddressId ? null : addressId);
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
        const response = await axios.delete(
          `http://127.0.0.1:8000/api/address/${addressId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          await fetchAddresses();
          setExpandedAddressId(null);

          Swal.fire({
            icon: 'success',
            title: 'Xóa địa chỉ thành công',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ:', error);
      
      if (error.response?.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Không thể xóa địa chỉ',
          text: 'Địa chỉ đang được sử dụng trong đơn hàng.',
        });
      } else if (error.response?.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Không tìm thấy địa chỉ',
          text: 'Vui lòng kiểm tra lại.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Có lỗi xảy ra',
          text: 'Vui lòng thử lại sau.',
        });
      }
    }
  };

  const handleCancel = () => {
    setExpandedAddressId(null);
  };

  if (loading) {
    return (
      <div className="col-lg-9">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="col-lg-9">
      <div className="page-content my-account__address">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="text-xl font-bold mb-0">Địa chỉ của tôi</p>
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
        <div className="my-account__address-list flex flex-col gap-4">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address.AddressID}
                className={`relative p-4 rounded-lg shadow-md bg-gray transition-transform duration-200 ${
                  address.IsDefault ? "border-2" : "border"
                }`}
              >
                {/* Nội dung địa chỉ và nút hành động */}
                <div className="flex items-center justify-between">
                  <div className="text-left flex-1">
                    <p className="text-sm text-gray-700 font-medium">
                      {address.Username} | {address.PhoneNumber}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {address.Address}
                    </p>

                    {address.IsDefault === 1 && (
                      <span className="inline-block mt-2 text-xs font-bold text-white bg-gray-800 rounded-full px-3 py-1">
                        Địa chỉ mặc định
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        className="px-4 py-2 text-sm text-gray-100 bg-dark"
                        onClick={() => toggleExpandAddress(address.AddressID)}
                      >
                        Sửa
                      </button>
                      <button
                        className="px-4 py-2 text-sm text-gray-100 bg-dark"
                        onClick={() => handleDeleteAddress(address.AddressID)}
                      >
                        Xóa
                      </button>
                    </div>
                    {!address.IsDefault && (
                      <button
                        className={`px-[19px] py-2 text-sm text-gray-100 bg-dark ${
                          isSettingDefault
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() =>
                          handleSetDefaultAddress(address.AddressID)
                        }
                        disabled={isSettingDefault}
                      >
                        {isSettingDefault
                          ? "Đang xử lý..."
                          : "Đặt làm mặc định"}
                      </button>
                    )}
                  </div>
                </div>

                {expandedAddressId === address.AddressID && (
                  <div className="expanded-content mt-4 p-4 border-t border-gray-300">
                    <Edit_Address
                      address={address}
                      onSuccess={() => {
                        toggleExpandAddress(null);
                        fetchAddresses();
                      }}
                      onCancel={handleCancel}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Không có địa chỉ. Vui lòng thêm địa chỉ mới.
            </p>
          )}
        </div>

        {editingAddress && (
          <Edit_Address
            address={editingAddress}
            onSuccess={() => {
              setEditingAddress(null);
              fetchAddresses();
            }}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
