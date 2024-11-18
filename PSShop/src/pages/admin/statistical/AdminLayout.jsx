import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarWithSearch } from './components/SidebarWithSearch';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-[20%] max-w-[300px]">
        <SidebarWithSearch />
      </div>
      <div className="w-[90%] mx-auto  overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

