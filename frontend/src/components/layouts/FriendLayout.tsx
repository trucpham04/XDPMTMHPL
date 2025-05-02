import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import FriendSideBar from "@/components/app/friend-navbar";
const FriendLayout: React.FC = () => {
  const location = useLocation();
  const isMainPage =
    location.pathname === "/friends" ||
    location.pathname === "/friends/birthdays";
  return (
    <div className="flex min-h-screen bg-gray-100">
      {isMainPage ? (
        <>
          <div className="fixed left-0 w-90">
            <FriendSideBar />
          </div>
          <div className="ml-90 flex-1">
            <Outlet />
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default FriendLayout;
