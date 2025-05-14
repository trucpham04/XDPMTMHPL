import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Video, X, Smile, ImagePlus } from "lucide-react";
import postService from "@/services/postService";
import { PostRequest, ViewerType } from "@/types/Post";
import { useAuthContext } from "@/contexts/AuthContext";
import { uploadImagesToCloudinary } from "@/utils/cloudiary";
import UserAvatar from "../app/userAvatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";

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
        userId: user?.id || 0,
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
        <UserAvatar user={user} />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer justify-start rounded-full bg-gray-100 px-4 py-2 text-gray-500"
            >
              Ấy ơi, bạn đang nghĩ gì thế?
            </Button>
          </DialogTrigger>

          <DialogContent className="fixed top-1/2 left-1/2 min-w-2xl -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-lg bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between border-b pb-4">
              <h1 className="text-2xl font-semibold">Tạo bài viết</h1>
            </div>

            {/* User info and visibility */}
            <div className="mb-4 flex items-center gap-3">
              <UserAvatar user={user} className="h-12 w-12" />
              <div className="flex flex-col gap-1">
                <p className="font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>
                <select
                  name="viewer"
                  className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-700"
                  value={viewer}
                  onChange={(e) => setViewer(e.target.value as ViewerType)}
                >
                  <option value={ViewerType.PUBLIC}>Mọi người</option>
                  <option value={ViewerType.FRIENDS}>Bạn bè</option>
                  <option value={ViewerType.PRIVATE}>Chỉ mình tôi</option>
                </select>
              </div>
            </div>

            {/* Post content */}
            <div className="mb-4">
              <textarea
                className="min-h-[150px] w-full resize-none rounded-lg border-none bg-transparent p-2 text-lg focus:outline-none"
                placeholder="Bạn đang nghĩ gì?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>

            {/* Media attachments */}
            <div className="mb-4">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />

              {mediaPreviews.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {mediaPreviews.map((media, idx) => (
                    <div key={idx} className="relative aspect-square">
                      {media.type === "video" ? (
                        <video
                          src={media.url}
                          className="h-full w-full rounded-lg object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={media.url}
                          alt={`Media ${idx + 1}`}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      )}
                      <button
                        className="absolute top-2 right-2 rounded-full bg-gray-800/60 p-1 text-white hover:bg-gray-800"
                        onClick={() => handleRemoveMedia(idx)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div
                className="flex cursor-pointer items-center gap-2 rounded-lg border p-4"
                onClick={handleAddMedia}
              >
                <p className="text-sm font-medium">Thêm vào bài viết</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={handleAddMedia}
                >
                  <ImagePlus size={24} />
                </Button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              className="w-full bg-blue-600 py-6 text-base font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
              onClick={handleSubmit}
              disabled={
                isUploading || (!content.trim() && mediaPreviews.length === 0)
              }
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <span>Đang đăng...</span>
                </div>
              ) : (
                "Đăng bài viết"
              )}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Các nút nhanh phía dưới */}
      <div className="mt-4 flex justify-around">
        <Button
          variant="outline"
          className="flex flex-1 cursor-pointer items-center space-x-2 border-0 shadow-none"
        >
          <Video className="size-5 text-red-500" />
          <span>Video trực tiếp</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-1 cursor-pointer items-center space-x-2 border-0 shadow-none"
        >
          <Camera className="size-5 text-green-500" />
          <span>Ảnh/video</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-1 cursor-pointer items-center space-x-2 border-0 shadow-none"
        >
          <Smile className="size-5 text-yellow-500" />
          <span>Cảm xúc/hoạt động</span>
        </Button>
      </div>
    </div>
  );
};
