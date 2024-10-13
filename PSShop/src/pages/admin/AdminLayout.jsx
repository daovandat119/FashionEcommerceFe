import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarWithSearch } from './components/SidebarWithSearch';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-[30%] max-w-[300px]">
        <SidebarWithSearch />
      </div>
      <div className="w-[80%] mx-auto p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

