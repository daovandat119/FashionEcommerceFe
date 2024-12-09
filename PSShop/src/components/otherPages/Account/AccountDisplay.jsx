import { useEffect, useState } from "react";


export default function AccountDisplay({ onEditClick }) {
  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/users/account", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setAccountData(result.data);
    };
    fetchAccountData();
  }, []);

  return (
    <div className="col-lg-9">
    <div className="my-account__info bg-gray-100 text-gray-800 p-6 rounded-lg shadow-md">
      {accountData && (
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-4">Thông tin tài khoản</h3>
            {accountData.image && (
              <img src={accountData.image} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
            )}
            <p><strong>Tên người dùng:</strong> {accountData.username}</p>
            <p><strong>Email:</strong> {accountData.email}</p>
            <p><strong>Trạng thái:</strong> {accountData.is_active ? "Kích hoạt" : "Không kích hoạt"}</p>
          </div>
          <button onClick={onEditClick} className="btn btn-secondary h-10 py-2 px-4 float-right bg-dark text-white rounded">
            Sửa tài khoản
          </button>
        </div>
      )}
      </div>
    </div>
  );
}