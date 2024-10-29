import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    }

    const handleBeforeUnload = () => {
      // Không xóa token khi tab bị đóng
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setShowToast(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setShowToast(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, showToast, setShowToast }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);