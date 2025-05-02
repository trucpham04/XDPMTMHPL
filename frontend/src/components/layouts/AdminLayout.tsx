import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/admin-sidebar";
const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 w-60">
        <AdminSidebar />
      </div>

      <div className="ml-60 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
