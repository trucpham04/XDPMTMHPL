import React, { useEffect, useState } from "react";
import { NewPostDialog } from "@/components/post/NewPostDialog";
import { CommentDialog } from "@/components/post/CommentDialog";
import { Post } from "@/types/Post";
import { useAuthContext } from "@/contexts/AuthContext";
import usePost from "@/hooks/usePost";
import useFriend from "@/hooks/useFriend";
import { User } from "@/types/User";
import { FriendsPosts } from "@/components/post/FriendsPosts";

const Home: React.FC = () => {
  const [openCommentIndex, setOpenCommentIndex] = useState<number | null>(null);
  const { user } = useAuthContext();
  const userId = user?.id || 0;
  const [openingPost, setOpeningPost] = useState<Post | null>(null);
  const [friends, setFriends] = useState<User[]>([]); // cập nhật friends

  const { fetchPostById, sharePost } = usePost();

  const { getAllFriends } = useFriend();

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const friends = await getAllFriends();
        setFriends(friends);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchFriend();
  }, []);

  const handleImageClick = (postIndex: number, imageIndex: number) => {
    console.log(`Clicked image ${imageIndex} in post ${postIndex}`);
  };

  const handleLikeClick = (postId: number) => {};

  const handleCommentClick = async (postId: number) => {
    await fetchPostById(postId).then((res) => {
      setOpeningPost(res);
      setOpenCommentIndex(postId);
    });
  };

  const handleShareClick = (postId: number) => {
    sharePost(postId, { userId: userId });
  };

  const handleCloseComment = () => {
    setOpenCommentIndex(null);
  };

  const handleSubmitComment = (commentText: string) => {};

  return (
    <div className="flex w-full flex-col items-center justify-center py-2">
      <NewPostDialog />

      <div className="w-full">
        <FriendsPosts
          friends={friends}
          onImageClick={handleImageClick}
          onLikeClick={handleLikeClick}
          onCommentClick={handleCommentClick}
          onShareClick={handleShareClick}
        />
      </div>

      {openCommentIndex !== null && (
        <CommentDialog
          post={openingPost}
          postIndex={openCommentIndex}
          isOpen={true}
          onClose={handleCloseComment}
          onLikeClick={() => handleLikeClick(openCommentIndex)}
          onCommentClick={() => {}}
          onImageClick={handleImageClick}
          onSubmitComment={handleSubmitComment}
        />
      )}
    </div>
  );
};

export default Home;
