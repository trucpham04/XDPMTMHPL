import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "@/components/app/app-navbar";

const DefaultLayout: React.FC = () => {
  const location = useLocation();
  const isFriendsPage =
    location.pathname === "/friends" ||
    location.pathname.startsWith("/friends/");
  const isAdminPage = location.pathname.startsWith("/admin");
  const isSearchPage = location.pathname.startsWith("/search");
  const isProfilePage = location.pathname.startsWith("/profile");
  return (
    <div className="bg-muted h-screen overflow-scroll">
      <AppSidebar />

      <main className="mt-14 flex items-center justify-center">
        <div
          className={
            isFriendsPage || isAdminPage || isSearchPage || isProfilePage
              ? "w-full"
              : "w-full max-w-3xl"
          }
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
