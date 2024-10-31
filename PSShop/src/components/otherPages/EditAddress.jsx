import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Add_Address from './Add_Address';
import Edit_Address from './Edit_Address';

export default function EditAddress() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

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

        <div className="my-account__address-list">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address.AddressID} className="my-account__address-item">
                <div className="my-account__address-item__title">
                  <h5>{address.Username}</h5>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => setEditingAddress(address)}
                    >
                      Sửa
                    </button>
                  </div>
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
