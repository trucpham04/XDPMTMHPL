import React from "react";
import { MoreHorizontal } from "lucide-react";
import { ImageGallery } from "./ImageGallery";
import { InteractionBar } from "./InteractionBar";
import { Post, SharedPost } from "@/types/Post";
import UserAvatar from "../app/userAvatar";
import { PostItem } from "./PostItem";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import usePost from "@/hooks/usePost";
import { User } from "@/types/User";
import { Link } from "react-router-dom";
import { getTimeAgo } from "@/utils";

interface SharedPostItemProps {
  sharedPostId: number;
  originalPostId: number;
  userId: number;
  author: User;
  createdAt: string;
  content: string;
  viewer: string;
  originalPost: Post; // Changed to Post instead of SharedPost["data"]
  postIndex: number;
  onImageClick: (postIndex: number, imageIndex: number) => void;
  onLikeClick: (index: number) => void;
  onCommentClick: (index: number) => void;
  onShareClick: (index: number) => void;
}

export const SharedPostItem: React.FC<SharedPostItemProps> = ({
  sharedPostId,
  originalPostId,
  userId,
  createdAt,
  content,
  viewer,
  author,
  originalPost,
  postIndex,
  onImageClick,
  onLikeClick,
  onCommentClick,
  onShareClick,
}) => {
  const { user } = useAuthContext();
  const { deleteShare } = usePost();
  const handleDeletePost = () => {
    deleteShare(originalPostId, sharedPostId);
  };
  return (
    <div className="flex flex-col rounded-2xl bg-white p-4 shadow-lg">
      {/* Shared Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to={`/profile/${author.id}`}>
            <UserAvatar user={author} />
          </Link>
          <div>
            <Link to={`/profile/${author.id}`}>
              <p className="font-semibold">
                {author.firstName} {author.lastName}
              </p>
            </Link>
            <span className="text-sm text-gray-500">
              {getTimeAgo(createdAt)}
            </span>
          </div>
        </div>
        {user?.id === userId && (
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
                Xóa bài chia sẻ
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="mt-2 rounded-md shadow-sm">
        <PostItem
          post={originalPost}
          index={postIndex}
          onImageClick={onImageClick}
          onLikeClick={onLikeClick}
          onCommentClick={onCommentClick}
          onShareClick={onShareClick}
        />
      </div>
    </div>
  );
};
