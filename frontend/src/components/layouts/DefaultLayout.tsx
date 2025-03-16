import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/app/app-navbar";

const DefaultLayout: React.FC = () => {
  return (
    <div className="bg-muted">
      <AppSidebar />

      <main className="mt-14 flex items-center justify-center">
        <div className="w-3xl max-w-3xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
