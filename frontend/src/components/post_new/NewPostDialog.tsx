import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Smile, Video, ImagePlus, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import postService from "@/services/postService";
import { MultiFile, PostRequest } from "@/types/Post_new";

export const NewPostDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [viewer, setViewer] = useState("Mọi người");
  const [mediaFiles, setMediaFiles] = useState<MultiFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMedia = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newMediaFiles: MultiFile[] = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
      }));
      setMediaFiles((prev) => [...prev, ...newMediaFiles]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const postRequest: PostRequest = {
      userId: 1, // TODO: thay bằng ID người dùng thực tế từ auth context nếu có
      content,
      multiFile: mediaFiles,
    };

    try {
      await postService.createPost(postRequest);
      setIsOpen(false);
      setContent("");
      setViewer("Mọi người");
      setMediaFiles([]);
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  return (
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

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <Dialog.Content className="fixed top-1/2 left-1/2 h-[550px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-2 shadow-lg">
              <Dialog.Close className="ml-[95%] cursor-pointer text-2xl font-bold text-gray-500">
                ✕
              </Dialog.Close>
              <div className="flex items-center justify-center">
                <h1 className="text-2xl font-semibold">Tạo bài viết</h1>
              </div>

              {/* Thông tin người dùng và chế độ xem */}
              <div className="m-6 flex items-center">
                <div className="flex flex-row gap-3">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Avatar"
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex flex-col justify-start gap-1">
                    <p className="ml-3 font-semibold">Minh Hằng</p>
                    <select
                      name="viewer"
                      className="rounded border border-gray-300 text-sm text-gray-700"
                      value={viewer}
                      onChange={(e) => setViewer(e.target.value)}
                    >
                      <option value="Mọi người">Mọi người</option>
                      <option value="Bạn bè">Bạn bè</option>
                      <option value="Chỉ mình tôi">Chỉ mình tôi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Nội dung bài viết */}
              <div className="flex h-2/5 w-full justify-center">
                <textarea
                  className="h-full w-[90%] overflow-auto border-none p-2 text-[17px]"
                  placeholder="Bạn đang nghĩ gì?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>

              {/* Ảnh/Video đính kèm */}
              <div className="mt-3 flex w-full justify-start">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline"
                  className="ml-4 flex items-center space-x-2 text-gray-700"
                  onClick={handleAddMedia}
                >
                  <ImagePlus size={24} />
                  <span>Thêm ảnh/video</span>
                </Button>
                <div className="ml-2 flex h-[70px] max-w-full flex-row gap-2 overflow-x-auto">
                  {mediaFiles.map((media, idx) => (
                    <div key={idx} className="relative">
                      {media.type === "video" ? (
                        <video
                          src={media.url}
                          className="h-[70px] w-[70px] rounded object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={media.url}
                          alt={`Media ${idx + 1}`}
                          className="h-[70px] w-[70px] rounded object-cover"
                        />
                      )}
                      <button
                        className="absolute top-0.5 right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-white"
                        onClick={() => handleRemoveMedia(idx)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút đăng bài */}
              <div className="mt-6 flex w-full justify-center">
                <Button
                  className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-500"
                  onClick={handleSubmit}
                >
                  <span>Đăng bài viết</span>
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Các nút nhanh phía dưới */}
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
  );
};
