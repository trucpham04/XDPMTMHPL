import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DefaultLayout from "@/components/layouts/DefaultLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import MessageLayout from "@/components/layouts/MessageLayout";
import Home from "@/pages/main/Home";
import FriendLayout from "@/components/layouts/FriendLayout";
import FriendHome from "@/pages/main/friends/FriendHome";
import FriendRequest from "@/pages/main/friends/FriendRequest";
import AllFriend from "@/pages/main/friends/AllFriend";
import FriendBirthday from "@/pages/main/friends/FriendBirthday";
import FriendCustomList from "@/pages/main/friends/FriendCustomList";
import MessagesPage from "@/pages/main/MessagesPage";
import Notifications from "@/pages/main/Notifications";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Profile from "@/pages/profile/Profile";
import SearchPage from "@/pages/main/SearchPage";
import AdminLayout from "@/components/layouts/AdminLayout";
import AdminUser from "@/pages/admin/user";
import AdminPost from "@/pages/admin/post";
import FriendSuggest from "@/pages/main/friends/FriendSuggest";

const routes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="friends/*" element={<FriendLayout />}>
            <Route index element={<FriendHome />} />
            <Route path="requests" element={<FriendRequest />} />
            {/* <Route path="sentRequest" element={<SentRequests />} /> */}
            <Route path="all" element={<AllFriend />} />
            <Route path="suggest" element={<FriendSuggest />} />
            {/* <Route path="birthdays" element={<FriendBirthday />} />                       
            <Route path="custom-list" element={<FriendCustomList />} /> */}
          </Route>
          <Route path="admin" element={<AdminLayout />}>        
            <Route path="user" element={<AdminUser />} />
            <Route path="post" element={<AdminPost />} />
          </Route>
          <Route path="notifications" element={<Notifications />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="profile/:user_id" element={<Profile />} />
        </Route>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/messages" element={<MessageLayout />}>
          <Route index element={<MessagesPage />} />
          <Route path=":id" element={<MessagesPage />} />
        </Route>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default routes;
