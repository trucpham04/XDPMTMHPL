import React from "react";
import { Button } from "@/components/ui/button";

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full bg-gray-100 min-h-screen">
      {/* Ảnh bìa */}
      <div className="w-full h-80 bg-gray-300 relative">
        <img
          src="https://via.placeholder.com/1200x400"
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Ảnh đại diện + Thông tin cá nhân */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 -mt-20 relative flex flex-col items-center">
        <img
          src="https://via.placeholder.com/180"
          alt="Avatar"
          className="w-40 h-40 rounded-full border-4 border-white absolute -top-20"
        />
        <div className="mt-20 text-center">
          <h1 className="text-3xl font-bold">Nguyễn Văn A</h1>
          <p className="text-gray-600 text-lg">Web Developer | React Enthusiast</p>
          <Button className="mt-4 px-6 py-2">Chỉnh sửa trang cá nhân</Button>
        </div>
      </div>

      {/* Menu trang cá nhân */}
      <div className="w-full max-w-5xl flex justify-around bg-white shadow-md rounded-lg mt-6 py-3">
        <Button variant="ghost">Bài viết</Button>
        <Button variant="ghost">Giới thiệu</Button>
        <Button variant="ghost">Bạn bè</Button>
        <Button variant="ghost">Ảnh</Button>
        <Button variant="ghost">Video</Button>
      </div>

      {/* Danh sách bài viết */}
      <div className="w-full max-w-5xl mt-6 space-y-4">
        {/* Hộp tạo bài viết */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center gap-3">
            <img
              src="https://via.placeholder.com/50"
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
            <input
              type="text"
              placeholder="Bạn đang nghĩ gì?"
              className="w-full p-2 border border-gray-300 rounded-full"
            />
          </div>
          <div className="flex justify-between mt-3">
            <Button variant="ghost">🖼 Ảnh/Video</Button>
            <Button variant="ghost">😃 Cảm xúc</Button>
            <Button variant="ghost">🎥 Video trực tiếp</Button>
          </div>
        </div>

        {/* Bài viết */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center gap-3">
            <img
              src="https://via.placeholder.com/50"
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold">Nguyễn Văn A</p>
              <p className="text-gray-500 text-sm">2 giờ trước</p>
            </div>
          </div>
          <p className="text-gray-700 mt-3">Hôm nay trời đẹp quá! 🌤️</p>
          <img
            src="https://via.placeholder.com/600x400"
            alt="Post"
            className="w-full mt-3 rounded-lg"
          />
          <div className="flex justify-between mt-3 text-gray-600">
            <Button variant="ghost">👍 Thích</Button>
            <Button variant="ghost">💬 Bình luận</Button>
            <Button variant="ghost">🔄 Chia sẻ</Button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center gap-3">
            <img
              src="https://via.placeholder.com/50"
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold">Nguyễn Văn A</p>
              <p className="text-gray-500 text-sm">Hôm qua</p>
            </div>
          </div>
          <p className="text-gray-700 mt-3">Vừa hoàn thành dự án React mới 🚀</p>
          <div className="flex justify-between mt-3 text-gray-600">
            <Button variant="ghost">👍 Thích</Button>
            <Button variant="ghost">💬 Bình luận</Button>
            <Button variant="ghost">🔄 Chia sẻ</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
