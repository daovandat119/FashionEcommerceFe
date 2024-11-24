import React, { useState, useEffect } from "react";
// Import your API service for fetching user data
// import { GetUserStatistics } from "../../service/api_service";

const UserStatisticsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Mock data for users
  const mockUsers = [
    { id: 1, name: "Nguyễn Văn A", email: "a@example.com", totalOrders: 5, totalSpent: 150000 },
    { id: 2, name: "Trần Thị B", email: "b@example.com", totalOrders: 3, totalSpent: 80000 },
    { id: 3, name: "Lê Văn C", email: "c@example.com", totalOrders: 10, totalSpent: 300000 },
    { id: 4, name: "Phạm Thị D", email: "d@example.com", totalOrders: 2, totalSpent: 50000 },
    { id: 5, name: "Nguyễn Văn E", email: "e@example.com", totalOrders: 7, totalSpent: 200000 },
    { id: 6, name: "Trần Thị F", email: "f@example.com", totalOrders: 1, totalSpent: 20000 },
    { id: 7, name: "Lê Văn G", email: "g@example.com", totalOrders: 4, totalSpent: 120000 },
    { id: 8, name: "Phạm Thị H", email: "h@example.com", totalOrders: 6, totalSpent: 180000 },
    { id: 9, name: "Nguyễn Văn I", email: "i@example.com", totalOrders: 8, totalSpent: 250000 },
    { id: 10, name: "Trần Thị J", email: "j@example.com", totalOrders: 9, totalSpent: 220000 },
  ];

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers); // Set mock data after a delay
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 border-2 border-gray-300 rounded-lg bg-white h-[400px]">
      <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>

      <div className="flex items-center mb-4">
        
        <input
          type="text"
          placeholder="Nhập tên người dùng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-auto h-[200px]">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Tên người dùng</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Tổng đơn hàng</th>
                <th className="border border-gray-300 p-2">Tổng chi tiêu</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.slice(0, itemsPerPage).map((user, index) => (
                <tr key={index} className="hover:bg-gray-50 text-center">
                  <td className="border border-gray-300 p-2">{user.id}</td>
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">{user.totalOrders}</td>
                  <td className="border border-gray-300 p-2">
                    {user.totalSpent.toLocaleString()} VNĐ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserStatisticsTable;