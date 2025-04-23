import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserAvatar from "@/components/app/userAvatar";
import { useAuthContext } from "@/contexts/AuthContext";
import { Post } from "@/types/Post";
import PostList from "@/components/post/PostList";
import { User } from "@/types/User";

const mockUser: User = {
  id: 1,
  username: "johndoe",
  email: "johndoe@example.com",
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  dateOfBirth: "1990-01-01",
  gender: "male",
  createdAt: "2024-01-01T10:00:00Z",
  profilePicture: "https://example.com/profiles/johndoe.jpg",
  bio: "Love traveling and photography.",
};

export const mockPosts: Post[] = [
  {
    id: 101,
    user: mockUser,
    content: "Had an amazing trip to the mountains! 🏔️",
    imageUrls: ["https://example.com/images/mountain1.jpg"],
    videoUrls: [],
    createdAt: new Date("2025-04-20T10:00:00"),
    updatedAt: new Date("2025-04-20T10:00:00"),
  },
  {
    id: 102,
    user: mockUser,
    content: "Throwback to my favorite beach vacation! 🌊☀️",
    imageUrls: [
      "https://example.com/images/beach1.jpg",
      "https://example.com/images/beach2.jpg",
    ],
    videoUrls: ["https://example.com/videos/beachwalk.mp4"],
    createdAt: new Date("2025-04-18T14:30:00"),
    updatedAt: new Date("2025-04-18T14:30:00"),
    likes: 120,
    comments: 45,
    shares: 10,
  },
  {
    id: 103,
    user: mockUser,
    content: "My new setup for streaming games 🎮🔥",
    imageUrls: ["https://example.com/images/setup.jpg"],
    videoUrls: [],
    createdAt: new Date("2025-04-17T09:45:00"),
    updatedAt: new Date("2025-04-17T09:45:00"),
    likes: 120,
    comments: 45,
    shares: 10,
  },
  {
    id: 104,
    user: mockUser,
    content: "Quick vlog update: life, work, and everything else!",
    imageUrls: [],
    videoUrls: ["https://example.com/videos/vlog1.mp4"],
    createdAt: new Date("2025-04-15T17:20:00"),
    updatedAt: new Date("2025-04-15T17:20:00"),
    likes: 120,
    comments: 45,
    shares: 10,
  },
  {
    id: 105,
    user: mockUser,
    content: "Captured this stunning sunset yesterday! 🌇",
    imageUrls: ["https://example.com/images/sunset.jpg"],
    videoUrls: [],
    createdAt: new Date("2025-04-14T18:00:00"),
    updatedAt: new Date("2025-04-14T18:00:00"),
    likes: 120,
    comments: 45,
    shares: 10,
  },
];

const Home: React.FC = () => {
  const { user } = useAuthContext();
  const [images, setImages] = useState([]);
  const [postContent, setPostContent] = useState("");

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
      }));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    URL.revokeObjectURL(updatedImages[index].url);
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  return (
    <div className="flex h-screen justify-center">
      <div className="flex h-auto w-[1000px] flex-col p-4">
        {/* Thanh đăng bài viết */}
        <div className="bg-background flex flex-col rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-4">
            <UserAvatar user={user} />
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"outline"}
                  className="flex-1 cursor-pointer justify-start rounded-full px-4 py-2 font-light"
                >
                  Ấy ơi, bạn đang nghĩ gì thế?
                </Button>
              </DialogTrigger>

              {/* Popup đăng bài */}
              <DialogContent className="bg-background fixed top-1/2 left-1/2 flex max-h-[550px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform flex-col rounded-lg p-2 shadow-lg">
                <DialogTitle className="flex items-center justify-center py-4">
                  <div className="text-2xl font-semibold">Tạo bài viết</div>
                </DialogTitle>

                <div className="flex items-center">
                  <div className="flex flex-row gap-3">
                    <UserAvatar user={user} />
                    <div className="flex flex-col justify-center gap-1">
                      <p className="ml-1 font-semibold">{user?.fullName}</p>
                      {/* <select
              name="privacy"
              className="ml-3 rounded border border-gray-300 text-sm text-gray-700 p-1"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option value="Mọi người">Mọi người</option>
              <option value="Bạn bè">Bạn bè</option>
              <option value="Chỉ mình tôi">Chỉ mình tôi</option>
            </select> */}
                    </div>
                  </div>
                </div>

                {/* <div className="flex h-32 w-full flex-1 justify-center"> */}
                <textarea
                  className="h-40 w-full resize-none rounded-lg border-0 border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  style={{ fontSize: "17px" }}
                  placeholder="Bạn đang nghĩ gì?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                ></textarea>
                {/* </div> */}

                {images.length > 0 && (
                  <div className="mt-2 flex max-h-25 flex-wrap gap-2 overflow-scroll">
                    {images.map((image, index) => (
                      <div key={index} className="relative h-[70px] w-[70px]">
                        <img
                          src={image.url}
                          alt={`Upload ${index + 1}`}
                          className="h-full w-full rounded object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="bg-background text-primary absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border p-1"
                          aria-label="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex w-full justify-start">
                  <Button
                    variant="outline"
                    className="ml-4 flex cursor-pointer items-center space-x-2 text-gray-700"
                    type="button"
                    asChild
                  >
                    <label htmlFor="image-upload">
                      <ImagePlus size={24} />
                      <span>Thêm ảnh</span>
                    </label>
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex w-full justify-center">
                  <Button
                    className="flex w-full cursor-pointer items-center space-x-2 bg-blue-600 px-6 text-white hover:bg-blue-500"
                    // onClick={handleSubmit}
                    // disabled={!postContent.trim() && images.length === 0}
                  >
                    <span>Đăng bài viết</span>
                  </Button>
                </div>
                {/* </DialogContent> */}
              </DialogContent>
            </Dialog>
          </div>

          {/* <div className="mt-4 flex justify-around">
            <Button variant="outline" className="flex items-center space-x-2">
              <Video className="text-red-500" size={20} />
              <span>Video trực tiếp</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Camera className="text-green-500" size={20} />
              <span>Ảnh/video</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Smile className="text-yellow-500" size={20} />
              <span>Cảm xúc/hoạt động</span>
            </Button>
          </div> */}
        </div>

        {/* Bài viết */}
        <PostList posts={mockPosts} className="py-4" />
      </div>
    </div>
  );
};

export default Home;
