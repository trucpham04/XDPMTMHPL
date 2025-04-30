import { MoreHorizontal } from "lucide-react";
import { ImageGallery } from "./ImageGallery";
import { InteractionBar } from "./InteractionBar";
import { Post } from "@/types/Post_new";

interface PostItemProps {
  post: Post;
  index: number;
  onImageClick: (postIndex: number, imageIndex: number) => void;
  onLikeClick: (postIndex: number) => void;
  onCommentClick: (postIndex: number) => void;
  onShareClick: (postIndex: number) => void;
}

export const PostItem: React.FC<PostItemProps> = ({
  post,
  index,
  onImageClick,
  onLikeClick,
  onCommentClick,
  onShareClick,
}) => {
  return (
    <div className="mt-8 flex flex-col rounded-2xl bg-white p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src={`https://i.pravatar.cc/150?img=${post.userId}`}
            alt={`Avatar of user ${post.userId}`}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="font-semibold">User {post.userId}</p>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        <MoreHorizontal className="cursor-pointer text-gray-500" />
      </div>

      {/* Content */}
      <div className="mt-4">
        <p className="text-left">{post.content}</p>
        {post.multiFile && post.multiFile.length > 0 && (
          <ImageGallery
            multiFiles={post.multiFile}
            postIndex={index}
            onImageClick={onImageClick}
          />
        )}
      </div>

      {/* Interaction Bar */}
      <InteractionBar
        likes={post.likes}
        isLiked={post.isLiked}
        commentsCount={post.comments}
        shares={post.shares}
        onLikeClick={() => onLikeClick(index)}
        onCommentClick={() => onCommentClick(index)}
        onShareClick={() => onShareClick(index)}
      />
    </div>
  );
};
