import React from "react";
import { Outlet } from "react-router-dom";
const SearchLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl">
        <Outlet />
      </div>
    </div>
  );
};

export default SearchLayout;
