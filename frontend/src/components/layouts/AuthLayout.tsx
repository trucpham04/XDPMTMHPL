import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="bg-muted">

      <main className="flex items-center justify-center">
        <div className="w-3xl max-w-3xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
