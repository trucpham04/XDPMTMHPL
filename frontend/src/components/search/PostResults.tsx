import React, { useEffect, useState } from "react";
import { PostItem } from "../post/PostItem";
import { Post } from "@/types/Post";
import { CommentDialog } from "../post/CommentDialog";
import { useAuthContext } from "@/contexts/AuthContext";
import usePost from "@/hooks/usePost";
import { useSearch } from "@/hooks/useSearch";

interface Props {
  query: string;
}

const PostResults: React.FC<Props> = ({ query }) => {
  const [openCommentIndex, setOpenCommentIndex] = useState<number | null>(null);
  const { user } = useAuthContext();
  const userId = user?.id || 0;
  const [openingPost, setOpeningPost] = useState<Post | null>(null);
  const { fetchPostById, sharePost } = usePost();
  const { posts, loading, searchPosts } = useSearch();

  useEffect(() => {
    if (!query.trim()) return;
    searchPosts(query);
  }, [query, searchPosts]);

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
    <>
      <h2 className="mb-4 text-xl font-bold">Posts</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 italic">No posts found for "{query}".</p>
      ) : (
        <>
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
        </>
      )}
    </>
  );
};

export default PostResults;
