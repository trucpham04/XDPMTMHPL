import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DefaultLayout from "@/components/layouts/DefaultLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import MessageLayout from "@/components/layouts/MessageLayout";

import Home from "@/pages/main/Home";
import Friends from "@/pages/main/Friends";
import Messages from "@/pages/main/Messages";
import Notifications from "@/pages/main/Notifications";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

const routes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="friends" element={<Friends />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/messages" element={<MessageLayout />}>
          <Route index element={<Messages />}></Route>
          <Route path=":id" element={<Messages />}></Route>
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default routes;
