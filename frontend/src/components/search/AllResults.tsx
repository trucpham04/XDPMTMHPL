import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/User";
import { Post } from "@/types/Post";
import { PostItem } from "../post/PostItem";
import { CommentDialog } from "../post/CommentDialog";
import { useAuthContext } from "@/contexts/AuthContext";
import usePost from "@/hooks/usePost";
import { useSearch } from "@/hooks/useSearch";

interface AllResultsProps {
  query: string;
  currentUserId: number;
}

const AllResults: React.FC<AllResultsProps> = ({ query, currentUserId }) => {
  const [openCommentIndex, setOpenCommentIndex] = useState<number | null>(null);
  const { user } = useAuthContext();
  const userId = user?.id || 0;
  const [openingPost, setOpeningPost] = useState<Post | null>(null);
  const { fetchPostById, sharePost } = usePost();
  const {
    users,
    posts,
    loading,
    error,
    searchUsers,
    searchPosts,
    saveSearchHistory,
  } = useSearch();

  useEffect(() => {
    if (!query.trim()) return;
    searchUsers(query, currentUserId);
    searchPosts(query);
  }, [query, currentUserId, searchUsers, searchPosts]);

  const handleUserClick = async (user: User) => {
    await saveSearchHistory(
      currentUserId,
      user.id,
      `${user.firstName} ${user.lastName}`,
    );
  };

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

  if (!query.trim()) return null;

  if (loading) return <p className="text-gray-500">🔄 Đang tải kết quả...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {users.length > 0 && (
        <div>
          <h2 className="mb-3 text-xl font-semibold">People</h2>
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profilePictureUrl || undefined} />
                    <AvatarFallback>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p
                      className="cursor-pointer font-medium hover:underline"
                      onClick={() => handleUserClick(user)}
                    >
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {posts.length > 0 && (
        <div>
          <h2 className="mb-3 text-xl font-semibold">Posts</h2>
          <ul className="space-y-4">
            {posts.map((post, index) => (
              <React.Fragment key={post.postId}>
                <PostItem
                  post={post}
                  index={index}
                  onCommentClick={handleCommentClick}
                  onImageClick={handleImageClick}
                  onLikeClick={handleLikeClick}
                  onShareClick={handleShareClick}
                />

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
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}

      {users.length === 0 && posts.length === 0 && (
        <p className="text-gray-500 italic">
          Không có kết quả tìm kiếm cho "{query}".
        </p>
      )}
    </div>
  );
};

export default AllResults;
