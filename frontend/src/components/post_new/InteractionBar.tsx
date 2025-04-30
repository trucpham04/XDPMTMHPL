import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

interface InteractionBarProps {
  likes: number;
  isLiked: boolean;
  commentsCount: number;
  shares: number;
  onLikeClick: () => void;
  onCommentClick: () => void;
  onShareClick: () => void;
}

export const InteractionBar: React.FC<InteractionBarProps> = ({
  likes,
  isLiked,
  commentsCount,
  shares,
  onLikeClick,
  onCommentClick,
  onShareClick,
}) => {
  return (
    <div>
      {/* Display the counts for likes, comments, and shares */}
      <div className="mt-4 flex items-center justify-between border-t pt-2">
        <div className="ml-2 flex space-x-4 text-sm text-gray-500">
          <span>{likes} lượt thích</span>
        </div>
        <div className="mr-2 flex space-x-4 text-sm text-gray-500">
          <span>{commentsCount} bình luận</span>
          <span>{shares} lượt chia sẻ</span>
        </div>
      </div>

      {/* Interaction buttons */}
      <div className="mt-2 flex justify-around border-t pt-2">
        <Button variant="ghost" className="flex items-center space-x-2" onClick={onLikeClick}>
          <ThumbsUp size={20} color={isLiked ? "blue" : "gray"} />
          <span className={isLiked ? "text-blue-500" : "text-gray-500"}>Thích</span>
        </Button>
        <Button variant="ghost" className="flex items-center space-x-2" onClick={onCommentClick}>
          <MessageCircle size={20} color="gray" />
          <span>Bình luận</span>
        </Button>
        <Button variant="ghost" className="flex items-center space-x-2" onClick={onShareClick}>
          <Share2 size={20} color="gray" />
          <span>Chia sẻ</span>
        </Button>
      </div>
    </div>
  );
};
