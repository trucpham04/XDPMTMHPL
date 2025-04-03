import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Smile,
  Video,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  ImagePlus,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const posts = [
    {
      userName: `Minh Hằng`,
      postContent: `hehe`,
      likes: 100,
      shares: 2,
      comments: 15,
      imageLinks: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
      viewer: `Mọi người`,
    },
    {
      userName: `Minh Hằng`,
      postContent: `Microsoft sẽ ngừng hỗ trợ ứng dụng Remote Desktop 
    từ Microsoft Store vào ngày 27/05/2025. Người dùng cần chuyển 
    sang ứng dụng mới có tên Windows App, hỗ trợ truy cập Windows 365, 
    Azure Virtual Desktop và Microsoft Dev Box. Microsoft sẽ ngừng hỗ trợ ứng dụng Remote Desktop 
    từ Microsoft Store vào ngày 27/05/2025. Người dùng cần chuyển 
    sang ứng dụng mới có tên Windows App, hỗ trợ truy cập Windows 365, 
    Azure Virtual Desktop và Microsoft Dev Box. Microsoft sẽ ngừng hỗ trợ ứng dụng Remote Desktop 
    từ Microsoft Store vào ngày 27/05/2025. Người dùng cần chuyển 
    sang ứng dụng mới có tên Windows App, hỗ trợ truy cập Windows 365, 
    Azure Virtual Desktop và Microsoft Dev Box. Microsoft sẽ ngừng hỗ trợ ứng dụng Remote Desktop 
    từ Microsoft Store vào ngày 27/05/2025. Người dùng cần chuyển 
    sang ứng dụng mới có tên Windows App, hỗ trợ truy cập Windows 365, 
    Azure Virtual Desktop và Microsoft Dev Box.`,
      likes: 100,
      shares: 2,
      comments: 15,
      imageLinks: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
      viewer: `Mọi người`,
    },
    {
      userName: `Minh Hằng`,
      postContent: `Microsoft sẽ ngừng hỗ trợ ứng dụng Remote Desktop 
    từ Microsoft Store vào ngày 27/05/2025. Người dùng cần chuyển 
    sang ứng dụng mới có tên Windows App, hỗ trợ truy cập Windows 365, 
    Azure Virtual Desktop và Microsoft Dev Box.`,
      likes: 100,
      shares: 2,
      comments: 15,
      imageLinks: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
      viewer: `Bạn bè`,
    },
    {
      userName: `Minh Hằng`,
      postContent: `Microsoft sẽ ngừng hỗ trợ ứng dụng Remote Desktop 
    từ Microsoft Store vào ngày 27/05/2025. Người dùng cần chuyển 
    sang ứng dụng mới có tên Windows App, hỗ trợ truy cập Windows 365, 
    Azure Virtual Desktop và Microsoft Dev Box.`,
      likes: 100,
      shares: 2,
      comments: 15,
      imageLinks: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
      viewer: `Mọi người`,
    },
  ];

  return (
    <div className="flex h-screen justify-center">
      <div className="flex h-auto w-[1000px] flex-col p-4">
        {/* Thanh đăng bài viết */}
        <div className="mt-16 flex h-[130px] flex-col rounded-2xl bg-white p-4 shadow-lg">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/40"
              alt="Avatar"
              className="h-10 w-10 rounded-full"
            />
            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
              <Dialog.Trigger asChild>
                <Button className="flex-1 justify-start rounded-full bg-gray-100 px-4 py-2 text-gray-500">
                  Ấy ơi, bạn đang nghĩ gì thế?
                </Button>
              </Dialog.Trigger>

              {/* Popup đăng bài */}
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <Dialog.Content className="fixed top-1/2 left-1/2 h-[550px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-2 shadow-lg">
                  <Dialog.Close className="ml-[95%] cursor-pointer text-2xl font-bold text-gray-500">
                    &#x2715;
                  </Dialog.Close>
                  <div className="flex items-center justify-center">
                    <h1 className="text-2xl font-semibold"> Tạo bài viết </h1>
                  </div>
                  <div className="m-6 flex items-center">
                    <div className="flex flex-row gap-3">
                      <img
                        src="https://via.placeholder.com/40"
                        alt="Avatar"
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex flex-col justify-start gap-1">
                        <p className="ml-3 font-semibold"> Minh Hằng </p>
                        <select
                          name="viewer"
                          className="rounded border border-gray-300 text-sm text-gray-700"
                          defaultValue="Mọi người"
                          onChange={(e) => e.target.value}
                        >
                          <option value="Mọi người">Mọi người</option>
                          <option value="Bạn bè">Bạn bè</option>
                          <option value="Chỉ mình tôi">Chỉ mình tôi</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-2/5 w-full justify-center">
                    <textarea
                      className="h-full w-[90%] overflow-auto border-2 border-none p-2"
                      style={{ fontSize: "17px" }}
                      placeholder="Bạn đang nghĩ gì?"
                      name=""
                      defaultValue=""
                      onChange={(e) => e.target.value}
                    ></textarea>
                  </div>
                  <div className="mt-3 flex w-full justify-start">
                    <Button
                      variant="outline"
                      className="ml-4 flex items-center space-x-2 text-gray-700"
                    >
                      <ImagePlus size={24} />
                      <span>Thêm ảnh</span>
                    </Button>
                    <div className="ml-2 flex h-[70px] w-auto max-w-full flex-row gap-2">
                      <img
                        src="https://via.placeholder.com/40"
                        alt=""
                        className="h-[70px] w-[70px]"
                      />
                      <img
                        src="https://via.placeholder.com/40"
                        alt=""
                        className="h-[70px] w-[70px]"
                      />
                      <img
                        src="https://via.placeholder.com/40"
                        alt=""
                        className="h-[70px] w-[70px]"
                      />
                      <img
                        src="https://via.placeholder.com/40"
                        alt=""
                        className="h-[70px] w-[70px]"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex w-full justify-center">
                    <Button className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-500">
                      <span>Đăng bài viết</span>
                    </Button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          <div className="mt-4 flex justify-around">
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
          </div>
        </div>

        {/* Bài viết */}
        {posts.map((post, index) => (
          <div
            key={index}
            className="mt-8 flex h-auto flex-col rounded-2xl bg-white p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Avatar"
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{post.userName}</p>
                  <span className="text-sm text-gray-500"> 16 giờ trước</span>
                </div>
              </div>
              <MoreHorizontal className="cursor-pointer text-gray-500" />
            </div>

            <div className="mt-4 flex h-auto flex-col items-center justify-center gap-2">
              <div className="ml-2 flex h-auto w-full items-center justify-start">
                <p>{post.postContent}</p>
              </div>
              <Carousel className="max-w-[500px]">
                <CarouselContent className="w-5/6">
                  {post.imageLinks.map((idx) => (
                    <CarouselItem key={idx}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square w-1/1 items-center justify-center p-6">
                            <span className="text-sm font-semibold">
                              {idx + 1}
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-2">
              <div className="ml-4 flex space-x-4 text-sm text-gray-500">
                <span>{post.likes} lượt thích</span>
              </div>
              <div className="mr-4 flex space-x-4 text-sm text-gray-500">
                <span>{post.comments} bình luận</span>
                <span>{post.shares} lượt chia sẻ</span>
              </div>
            </div>

            <div className="mt-2 flex justify-around border-t pt-2">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ThumbsUp size={20} color="gray" />
                <span>Thích</span>
              </Button>
              <Button variant="ghost" className="flex items-center space-x-2">
                <MessageCircle size={20} color="gray" />
                <span>Bình luận</span>
              </Button>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Share2 size={20} color="gray" />
                <span>Chia sẻ</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
