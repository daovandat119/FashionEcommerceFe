import React, { useEffect, useState } from 'react';
import { Input } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PencilIcon, PlusIcon, XMarkIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { ListUsers } from '../service/api_service'; // Import hàm ListUsers

const UserList = () => {
  const [Users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await ListUsers(1); // Lấy trang đầu tiên
        setUsers(response.data); // Giả sử response.data chứa danh sách người dùng
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getStatusLabel = (user) => {
    return user.IsActive ? { label: "Active", color: "bg-green-500" } : { label: "Blocked", color: "bg-red-500" };
  };

  const getRoleName = (roleID) => {
    switch (roleID) {
      case 1:
        return "Admin";
      case 2:
        return "User";
      default:
        return "Unknown";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search users"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
          />
        </div>
        <Link to="/admin/users/add" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
          <PlusIcon className="h-5 w-5" /> New User
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-max border-collapse">
          <thead className="hover:bg-gray-50 ">
            <tr>
              <th className="border-b p-4 text-left">STT</th>
              <th className="border-b p-4 text-left">Name</th>
              <th className="border-b p-4 text-left">Email</th>
              <th className="border-b p-4 text-left">Role</th>
              <th className="border-b p-4 text-left">Status</th>
              <th className="border-b p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Users.map((user, index) => {
              const { label, color } = getStatusLabel(user);
              return (
                <tr key={user.UserID} className="hover:bg-gray-50">
                  <td className="border-b p-4">{index + 1}</td>
                  <td className="border-b p-4">{user.Username}</td>
                  <td className="border-b p-4">{user.Email}</td>
                  <td className="border-b p-4">{getRoleName(user.RoleID)}</td>
                  <td className="border-b p-4 flex items-center py-5">
                    <span className={`h-2 w-2 rounded-full ${color} mr-2`} />
                    {label}
                  </td>
                  <td className="border-b p-4">
                    <Link
                      to={`/admin/users/edit-users/${user.UserID}`} // Truyền UserID vào URL
                      className="bg-blue-500 text-white p-2 rounded-full mr-2 hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/admin/users/delete/${user.UserID}`}
                      className="bg-red-600 text-white p-2 rounded-full mr-2 hover:bg-red-500 transition-colors inline-flex items-center justify-center"
                    >
                      <LockClosedIcon className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
