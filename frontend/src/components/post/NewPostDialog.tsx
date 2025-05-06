import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import postService from "@/services/postService";
import { PostRequest, ViewerType } from "@/types/Post";
import { useAuthContext } from "@/contexts/AuthContext";
import { uploadImagesToCloudinary } from "@/utils/cloudiary";
import UserAvatar from "../app/userAvatar";

// Define a type for media preview
type MediaPreview = {
  url: string;
  type: "image" | "video";
  file: File;
};

export const NewPostDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [viewer, setViewer] = useState<ViewerType>(ViewerType.PUBLIC);
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthContext();

  // Clean up object URLs when the component unmounts
  useEffect(() => {
    return () => {
      // Revoke all object URLs when component unmounts
      mediaPreviews.forEach((media) => URL.revokeObjectURL(media.url));
    };
  }, []);

  const handleAddMedia = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newMediaPreviews: MediaPreview[] = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
      file,
    }));

    setMediaPreviews((prev) => [...prev, ...newMediaPreviews]);

    // Reset the file input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveMedia = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(mediaPreviews[index].url);
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (mediaPreviews.length === 0 && !content.trim()) {
      // Don't submit empty posts
      return;
    }

    try {
      setIsUploading(true);

      // Extract the actual File objects for upload
      const files = mediaPreviews.map((media) => media.file);

      // Only upload if there are files
      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        uploadedUrls = await uploadImagesToCloudinary(files);
      }

      // Prepare post data
      const postRequest: PostRequest = {
        userId: user?.id,
        content,
        multiFile: uploadedUrls.map((url, index) => ({
          url,
          type: mediaPreviews[index].type,
        })),
        viewer,
      };

      // Create post
      await postService.createPost(postRequest);

      // Clean up object URLs
      mediaPreviews.forEach((media) => URL.revokeObjectURL(media.url));

      // Clear state after successful submission
      setIsOpen(false);
      setContent("");
      setViewer(ViewerType.PUBLIC);
      setMediaPreviews([]);
    } catch (error) {
      console.error("Failed to create post", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-fit w-full flex-col rounded-2xl bg-white p-4 shadow-lg">
      <div className="flex items-center space-x-4">
        {/* <img
          src={user?.profilePictureUrl || "https://via.placeholder.com/40"}
          alt="Avatar"
          className="h-10 w-10 rounded-full"
        /> */}
        <UserAvatar user={user} />
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger asChild>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer justify-start rounded-full bg-gray-100 px-4 py-2 text-gray-500"
            >
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
                    src={user?.profilePictureUrl}
                    alt=""
                    className="bg-muted-foreground inline-flex size-10 items-center justify-center rounded-full"
                  />
                  <div className="flex flex-col justify-start gap-1">
                    <p className="ml-3 font-semibold">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <select
                      name="viewer"
                      className="rounded border border-gray-300 text-sm text-gray-700"
                      value={viewer}
                      onChange={(e) => setViewer(e.target.value as ViewerType)}
                    >
                      <option value={ViewerType.PUBLIC}>Mọi người</option>
                      <option value={ViewerType.FRIENDS}>Bạn bè</option>
                      <option value={ViewerType.PRIVATE}>Chỉ mình tôi</option>
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
                  {mediaPreviews.map((media, idx) => (
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
                  className="flex w-full items-center space-x-2 bg-blue-600 text-white hover:bg-blue-500"
                  onClick={handleSubmit}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      <span>Đang đăng...</span>
                    </>
                  ) : (
                    <span>Đăng bài viết</span>
                  )}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Các nút nhanh phía dưới */}
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
  );
};
