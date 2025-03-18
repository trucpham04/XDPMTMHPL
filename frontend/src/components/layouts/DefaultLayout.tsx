import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "@/components/app/app-navbar";

const DefaultLayout: React.FC = () => {
  const location = useLocation();
  const isFriendsPage = location.pathname === "/friends" || location.pathname.startsWith("/friends/")||
  location.pathname.startsWith("/search");  
  return (
    <div className="bg-muted">
      <AppSidebar />

      <main className="min-h-screen mt-14 flex items-center justify-center">
      <div className={isFriendsPage ? "w-full min-h-screen" : "w-3xl max-w-3xl min-h-screen"}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
