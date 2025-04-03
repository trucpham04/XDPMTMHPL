import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DefaultLayout from "@/components/layouts/DefaultLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import MessageLayout from "@/components/layouts/MessageLayout";
import Home from "@/pages/main/Home";
import FriendPage from "@/pages/main/friends/FriendPage";
import FriendHome from "@/pages/main/friends/FriendHome";
import FriendRequest from "@/pages/main/friends/FriendRequest";
import FriendSuggest from "@/pages/main/friends/FriendSuggest";
import AllFriend from "@/pages/main/friends/AllFriend";
import FriendBirthday from "@/pages/main/friends/FriendBirthday";
import FriendCustomList from "@/pages/main/friends/FriendCustomList";
import MessagesPage from "@/features/messages/pages/MessagesPage";
import Notifications from "@/pages/main/Notifications";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Profile from "@/pages/profile/Profile";
import SearchPage from "@/pages/main/search/SearchPage";

const routes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="friends/*" element={<FriendPage />}>
            <Route index element={<FriendHome />} />
            <Route path="requests" element={<FriendRequest />} />
            <Route path="suggestions" element={<FriendSuggest />} />
            <Route path="all" element={<AllFriend />} />
            <Route path="birthdays" element={<FriendBirthday />} />
            <Route path="custom-list" element={<FriendCustomList />} />
          </Route>
          <Route path="notifications" element={<Notifications />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="profile" element={<Profile />} />
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
