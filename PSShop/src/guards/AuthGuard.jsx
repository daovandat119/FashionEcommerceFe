import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Comment out this line

const AuthGuard = ({ children }) => {
  // const { isAuthenticated } = useAuth(); // Comment out this line
  // const location = useLocation(); // You can keep this if needed for other purposes

  // Tạm thời comment out logic kiểm tra xác thực
  // if (!isAuthenticated) {
  //   return <Navigate to="/admin/login" state={{ from: location }} replace />;
  // }

  // Luôn cho phép truy cập
  return children;
};

export default AuthGuard;
