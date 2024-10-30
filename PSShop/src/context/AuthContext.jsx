import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roleID, setRoleID] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const isFirstLoad = sessionStorage.getItem('isFirstLoad');

    if (!isFirstLoad) {
      localStorage.removeItem('token');
      sessionStorage.setItem('isFirstLoad', 'true');
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setIsAuthenticated(true);
      const storedRoleID = localStorage.getItem('RoleID');
      if (storedRoleID) {
        setRoleID(storedRoleID);
      }
    }

    const handleBeforeUnload = () => {
      // Không xóa token khi tab bị đóng
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('RoleID', role);
    setIsAuthenticated(true);
    setRoleID(role);
    setShowToast(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roleID');
    setIsAuthenticated(false);
    setRoleID(null);
    setShowToast(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, roleID, login, logout, showToast, setShowToast }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);