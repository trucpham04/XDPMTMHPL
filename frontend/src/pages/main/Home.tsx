import React, { useEffect, useState } from "react";
import { NewPostDialog } from "@/components/post/NewPostDialog";
import { CommentDialog } from "@/components/post/CommentDialog";
import { Post } from "@/types/Post";
import { useAuthContext } from "@/contexts/AuthContext";
import usePost from "@/hooks/usePost";
import useFriend from "@/hooks/useFriend";
import { User } from "@/types/User";
import { FriendsPosts } from "@/components/post/FriendsPosts";
import { Stories } from "@/components/stories/Stories";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";

const Home: React.FC = () => {
  const [openCommentIndex, setOpenCommentIndex] = useState<number | null>(null);
  const { user } = useAuthContext();
  const userId = user?.id || 0;
  const [openingPost, setOpeningPost] = useState<Post | null>(null);
  // const [friends, setFriends] = useState<User[]>([]);

  const { fetchPostById, sharePost } = usePost();
  const { fetchFriends, friends } = useFriend();

  // Mock stories data
  const mockStories = [
    {
      id: 1,
      user: user || {
        id: 1,
        firstName: "You",
        lastName: "",
        email: "",
        profilePictureUrl: "",
        roles: [],
      },
      imageUrl: "https://via.placeholder.com/300x500",
    },
    ...friends.slice(0, 5).map((friend, index) => ({
      id: index + 2,
      user: friend,
      imageUrl: `https://via.placeholder.com/300x500?text=${friend.firstName}'s+Story`,
    })),
  ];

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        await fetchFriends();
        // setFriends(friends);
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
    const post = await fetchPostById(postId);
    if (post) {
      setOpeningPost(post);
      setOpenCommentIndex(postId);
    }
  };

  const handleShareClick = (postId: number) => {
    sharePost(postId, { userId: userId });
  };

  const handleCloseComment = () => {
    setOpenCommentIndex(null);
  };

  const handleSubmitComment = (commentText: string) => {};

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <main className="flex-1 px-4 pt-4">
        <div className="mx-auto">
          {/* Stories Section */}
          <Stories stories={mockStories} />

          {/* Create Post */}
          <div className="mb-6">
            <NewPostDialog />
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            <FriendsPosts
              friends={friends}
              onImageClick={handleImageClick}
              onLikeClick={handleLikeClick}
              onCommentClick={handleCommentClick}
              onShareClick={handleShareClick}
            />
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <RightSidebar friends={friends} />

      {/* Comment Dialog */}
      {openCommentIndex !== null && openingPost && (
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
