import { MoreHorizontal } from "lucide-react";
import { ImageGallery } from "./ImageGallery";
import { InteractionBar } from "./InteractionBar";
import { Post } from "@/types/Post";
import { useState } from "react";
import usePost from "@/hooks/usePost";
import { useAuthContext } from "@/contexts/AuthContext";
import UserAvatar from "../app/userAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface PostItemProps {
  post: Post;
  index: number;
  onImageClick: (postId: number, imageIndex: number) => void;
  onLikeClick: (postId: number) => void;
  onCommentClick: (postId: number) => void;
  onShareClick: (postId: number) => void;
}

export const PostItem: React.FC<PostItemProps> = ({
  post,
  index,
  onImageClick,
  onLikeClick,
  onCommentClick,
  onShareClick,
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const { likePost, unlikePost, deletePost } = usePost();
  const { user } = useAuthContext();
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

  const handleDeletePost = () => {
    deletePost(post.postId);
  };

  return (
    <div className="flex flex-col rounded-2xl bg-white p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <UserAvatar user={post.author} />
          <div>
            <p className="font-semibold">
              {post.author.firstName} {post.author.lastName}
            </p>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        {user?.id === post.author.id && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal className="cursor-pointer text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Button
                onClick={handleDeletePost}
                variant={"outline"}
                className="w-full cursor-pointer"
              >
                Xóa bài viết
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      <div className="my-2 flex flex-col items-center justify-center gap-2">
        <p className="mb-2 w-full text-left">{post.content}</p>
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
        likes={likes}
        isLiked={isLiked}
        commentsCount={post.comments}
        shares={post.shares}
        onLikeClick={handleLikeClick}
        onCommentClick={() => onCommentClick(post.postId)}
        onShareClick={() => onShareClick(post.postId)}
      />
    </div>
  );
};
