import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DefaultLayout from "@/layouts/DefaultLayout";

import Home from "@/pages/main/Home";
import Friends from "@/pages/main/Friends";
import Messages from "@/pages/main/Messages";
import Notifications from "@/pages/main/Notifications";
import AuthLayout from "@/layouts/AuthLayout";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

const routes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="friends" element={<Friends />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default routes;
