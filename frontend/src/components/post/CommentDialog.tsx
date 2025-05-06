import { useEffect, useState } from "react";
import { Send, Smile, Camera } from "lucide-react";
import { ImageGallery } from "./ImageGallery";
import { InteractionBar } from "./InteractionBar";
import { Comment, Post } from "@/types/Post";
import usePost from "@/hooks/usePost";
import { useAuthContext } from "@/contexts/AuthContext";
import UserAvatar from "../app/userAvatar";

// Interface đồng bộ với backend chuẩn hóa

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
  const [comments, setComments] = useState<Comment[]>([]);
  const { fetchComments, addComment } = usePost();
  const { user } = useAuthContext();

  const fetchCommentsData = async () => {
    const data = await fetchComments(post.postId);
    setComments(data);
  };

  useEffect(() => {
    if (isOpen) {
      fetchCommentsData();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onSubmitComment(commentText);
      setCommentText("");
      addComment(post.postId, { userId: user?.id, content: commentText });
    }

    setTimeout(fetchCommentsData, 500);
  };

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const { likePost, unlikePost } = usePost();
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    const userId = user?.id || 0;
    const likeData = {
      userId: userId,
    };

    if (isLiked) {
      unlikePost(post.postId, userId);
    } else {
      likePost(post.postId, likeData);
    }

    onLikeClick(post.postId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
      <div className="flex h-[70vh] w-full max-w-2xl flex-col overflow-y-auto rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
          <h3 className="text-lg font-semibold">
            Bài viết của {post.author.firstName} {post.author.lastName}
          </h3>
          <button onClick={onClose} className="cursor-pointer">
            <svg
              className="h-6 w-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Post Content */}
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <img
              src={post.author.profilePictureUrl || ""}
              alt={post.author.firstName[0].toUpperCase()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-500"
            />
            <div>
              <p className="font-semibold">
                {post.author.firstName} {post.author.lastName}
              </p>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center justify-center gap-2">
            <div className="ml-2 w-full text-left">
              <p>{post.content}</p>
            </div>
            {post.multiFile && post.multiFile.length > 0 && (
              <ImageGallery
                multiFiles={post.multiFile}
                postIndex={postIndex}
                onImageClick={onImageClick}
              />
            )}
          </div>

          <InteractionBar
            likes={likes}
            isLiked={isLiked}
            commentsCount={post.comments}
            shares={post.shares}
            onLikeClick={handleLikeClick}
            onCommentClick={onCommentClick}
            onShareClick={() => {}}
          />
        </div>

        {/* Comments Section */}
        <div className="flex-1 border-t p-4">
          <h3 className="mb-2 font-semibold">Bình luận</h3>
          {comments.map((comment, idx) => (
            <div key={idx} className="mb-4 flex items-start gap-2">
              <UserAvatar user={comment.user} className="size-10" />
              <div className="flex-1">
                <div className="rounded-lg bg-gray-100 p-2">
                  <p className="text-sm font-semibold">
                    {comment.user.firstName} {comment.user.lastName}
                  </p>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <div className="mt-1 flex space-x-2 text-sm text-gray-500">
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  {/* <button className="hover:text-blue-500">Thích</button>
                  <button className="hover:text-blue-500">Phản hồi</button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="sticky bottom-0 border-t bg-white p-4">
          <div className="flex items-center space-x-2">
            <UserAvatar user={user} />
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCommentSubmit();
                }
              }}
              placeholder="Viết bình luận..."
              className="flex-1 rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button onClick={handleCommentSubmit}>
              <Send size={20} className="text-gray-500 hover:text-blue-500" />
            </button>
          </div>
          {/* <div className="mt-2 ml-12 flex space-x-3">
            <button>
              <Smile size={20} className="text-gray-500" />
            </button>
            <button>
              <Camera size={20} className="text-gray-500" />
            </button>
            <button className="text-sm font-semibold text-gray-500">GIF</button>
            <button>
              <Smile size={20} className="text-gray-500" />
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
