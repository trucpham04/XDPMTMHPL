import { useState } from "react";
import * as React from "react"
import { Button } from "@/components/ui/button";
import { Camera, Smile, Video, MoreHorizontal, ThumbsUp, MessageCircle, Share2, ImagePlus } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const posts = Array(
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
      viewer: `Mọi người`
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
      viewer: `Mọi người`
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
      viewer: `Bạn bè`
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
        "https://via.placeholder.com/150"
      ],
      viewer: `Mọi người`
    }
  );

  return (
    <div className="flex h-screen justify-center">
      <div className="h-auto w-[1000px] flex flex-col p-4">
        {/* Thanh đăng bài viết */}
        <div className="h-[130px] bg-white shadow-lg rounded-2xl p-4 flex flex-col mt-16">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/40"
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
              <Dialog.Trigger asChild>
                <Button className="flex-1 justify-start text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  Ấy ơi, bạn đang nghĩ gì thế?
                </Button>
              </Dialog.Trigger>

              {/* Popup đăng bài */}
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[550px] bg-white rounded-lg shadow-lg p-2">
                  <Dialog.Close className="text-gray-500 cursor-pointer text-2xl font-bold ml-[95%]">
                    &#x2715;
                  </Dialog.Close>
                  <div className="flex justify-center items-center">
                    <h1 className="text-2xl font-semibold"> Tạo bài viết </h1>
                  </div>
                  <div className="flex items-center m-6">
                    <div className="flex flex-row gap-3">
                      <img src="https://via.placeholder.com/40" alt="Avatar" className="w-10 h-10 rounded-full" />
                      <div className="flex flex-col gap-1 justify-start">
                        <p className="ml-3 font-semibold"> Minh Hằng </p>
                        <select
                          name="viewer"
                          className="border border-gray-300 rounded text-sm text-gray-700"
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
                  <div className="w-full h-2/5 flex justify-center">
                    <textarea className="w-[90%] h-full border-2 border-none overflow-auto p-2" style={{ fontSize: '17px' }}
                      placeholder="Bạn đang nghĩ gì?" name=''
                      defaultValue=""
                      onChange={(e) => e.target.value}>
                    </textarea>
                  </div>
                  <div className="flex justify-start mt-3 w-full">
                    <Button  variant="outline" className="flex items-center space-x-2 ml-4 text-gray-700">
                      <ImagePlus  size={24} />
                      <span>Thêm ảnh</span>
                    </Button>
                    <div className="w-auto max-w-full h-[70px] flex flex-row gap-2 ml-2"> 
                      <img src="https://via.placeholder.com/40" alt="" className="h-[70px] w-[70px]" />
                      <img src="https://via.placeholder.com/40" alt="" className="h-[70px] w-[70px]" />
                      <img src="https://via.placeholder.com/40" alt="" className="h-[70px] w-[70px]" />
                      <img src="https://via.placeholder.com/40" alt="" className="h-[70px] w-[70px]" />

                    </div>
                  </div>
                  <div className="flex justify-center mt-6 w-full">
                    <Button className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-500 ">
                      <span>Đăng bài viết</span>
                    </Button>
                  </div>

                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          <div className="flex justify-around mt-4">
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
          <div key={index} className="h-auto bg-white shadow-lg rounded-2xl p-4 flex flex-col mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="https://via.placeholder.com/40" alt="Avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold">{post.userName}</p>
                  <span className="text-gray-500 text-sm"> 16 giờ trước</span>
                </div>
              </div>
              <MoreHorizontal className="text-gray-500 cursor-pointer" />
            </div>

            <div className="mt-4 flex flex-col justify-center items-center h-auto gap-2">
              <div className="h-auto flex items-center justify-start ml-2 w-full">
                <p>{post.postContent}</p>
              </div>
              <Carousel className="max-w-[500px]">
                <CarouselContent className="w-5/6">
                  {post.imageLinks.map((idx) => (
                    <CarouselItem key={idx}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6 w-1/1">
                            <span className="text-sm font-semibold">{idx + 1}</span>
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

            <div className="flex justify-between items-center mt-4 border-t pt-2">
              <div className="flex space-x-4 text-gray-500 text-sm ml-4">
                <span>{post.likes} lượt thích</span>
              </div>
              <div className="flex space-x-4 text-gray-500 text-sm mr-4">
                <span>{post.comments} bình luận</span>
                <span>{post.shares} lượt chia sẻ</span>
              </div>
            </div>

            <div className="flex justify-around mt-2 border-t pt-2">
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