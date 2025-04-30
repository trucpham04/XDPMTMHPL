import { useState } from "react";
import { Send, Smile, Camera } from "lucide-react";
import { ImageGallery } from "./ImageGallery";
import { InteractionBar } from "./InteractionBar";

// Interface đồng bộ với backend chuẩn hóa
interface MultiFile {
  url: string;
  type: "image" | "video";
}

interface Post {
  userId: number;
  content: string;
  likes: number;
  isLiked: boolean;
  shares: number;
  comments: number;
  multiFile: MultiFile[];
}

interface CommentDialogProps {
  post: Post;
  postIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onLikeClick: () => void;
  onCommentClick: () => void;
  onImageClick: (postIndex: number, imageIndex: number) => void;
  onSubmitComment: (commentText: string) => void;
}

export const CommentDialog: React.FC<CommentDialogProps> = ({
  post,
  postIndex,
  isOpen,
  onClose,
  onLikeClick,
  onCommentClick,
  onImageClick,
  onSubmitComment,
}) => {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onSubmitComment(commentText);
      setCommentText("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl h-[80vh] rounded-lg overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b">
          <h3 className="font-semibold text-lg">Bài viết của User {post.userId}</h3>
          <button onClick={onClose}>
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Post Content */}
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <img
              src={`https://i.pravatar.cc/150?img=${post.userId}`}
              alt="Avatar"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-semibold">User {post.userId}</p>
              <span className="text-sm text-gray-500">16 giờ trước</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center justify-center gap-2">
            <div className="ml-2 w-full text-left">
              <p>{post.content}</p>
            </div>
            <ImageGallery
              multiFiles={post.multiFile}
              postIndex={postIndex}
              onImageClick={onImageClick}
            />
          </div>

          <InteractionBar
            likes={post.likes}
            isLiked={post.isLiked}
            commentsCount={post.comments}
            shares={post.shares}
            onLikeClick={onLikeClick}
            onCommentClick={onCommentClick}
            onShareClick={() => {}}
          />
        </div>

        {/* Comments Section */}
        <div className="p-4 border-t">
          <h3 className="font-semibold mb-2">Bình luận</h3>
          {Array.from({ length: post.comments }).map((_, idx) => (
            <div key={idx} className="flex items-start mb-4">
              <img
                src={`https://i.pravatar.cc/40?img=${idx + 2}`}
                alt="User avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <div className="flex-1">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <p className="font-semibold text-sm">Người dùng {idx + 1}</p>
                  <p className="text-sm">Đây là bình luận mẫu số {idx + 1}.</p>
                </div>
                <div className="flex space-x-2 mt-1 text-sm text-gray-500">
                  <span>15 giờ</span>
                  <button className="hover:text-blue-500">Thích</button>
                  <button className="hover:text-blue-500">Phản hồi</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="sticky bottom-0 bg-white p-4 border-t">
          <div className="flex items-center space-x-2">
            <img
              src="https://i.pravatar.cc/40?img=1"
              alt="Avatar"
              className="h-10 w-10 rounded-full"
            />
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Viết bình luận..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleCommentSubmit}>
              <Send size={20} className="text-gray-500 hover:text-blue-500" />
            </button>
          </div>
          <div className="flex space-x-3 mt-2 ml-12">
            <button><Smile size={20} className="text-gray-500" /></button>
            <button><Camera size={20} className="text-gray-500" /></button>
            <button className="text-gray-500 text-sm font-semibold">GIF</button>
            <button><Smile size={20} className="text-gray-500" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
