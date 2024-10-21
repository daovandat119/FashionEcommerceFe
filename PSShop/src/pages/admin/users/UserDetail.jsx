import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ListUsers } from '../service/api_service'; // Import hàm ListUsers

const UserDetail = () => {
  const { id } = useParams(); // Lấy ID người dùng từ URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await ListUsers(id); // Gọi API để lấy thông tin người dùng
        setUser(response.data); // Giả sử response.data chứa thông tin người dùng
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Detail</h1>
      {user && (
        <div>
          <h2 className="text-xl font-semibold">Username: {user.Username}</h2>
          <p>Email: {user.Email}</p>
          <p>Role: {user.RoleID === 1 ? 'Admin' : 'User'}</p>
          <p>Status: {user.IsActive ? 'Active' : 'Blocked'}</p>
          {/* Thêm các thông tin khác nếu cần */}
        </div>
      )}
    </div>
  );
};

export default UserDetail;

