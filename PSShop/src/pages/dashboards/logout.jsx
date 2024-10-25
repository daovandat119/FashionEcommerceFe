import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token từ localStorage hoặc sessionStorage
    localStorage.removeItem('token'); // nếu bạn lưu token ở localStorage
    sessionStorage.removeItem('token'); // nếu bạn lưu token ở sessionStorage

    // Chuyển hướng người dùng đến trang đăng nhập
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="btn-logout">
      Đăng xuất
    </button>
  );
};

export default Logout;