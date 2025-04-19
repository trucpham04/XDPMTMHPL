import React from "react";
import { Outlet, useLocation, useOutlet } from "react-router-dom";
import FriendSideBar from "@/components/app/friend-navbar";
const FriendLayout: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();
  console.log("Outlet content:", outlet);
  const isMainPage = location.pathname === "/friends" || location.pathname === "/friends/birthdays" ;
  return (
    <div className="flex min-h-screen bg-gray-100 ">
      {isMainPage ?(
        <>
            <div className="w-90 fixed left-0">
              <FriendSideBar />
            </div>
            <div className="flex-1 ml-90">            
              <Outlet /> 
            </div>
        </>
          
      ): (        
              <Outlet /> 
      )}
      
    </div>
  );
};

export default FriendLayout;
