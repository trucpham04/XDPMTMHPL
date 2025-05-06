import React, { useEffect, useState } from "react";
import axios from "axios";
import { PostItem } from "../post/PostItem";
import { Post } from "@/types/Post";
import { CommentDialog } from "../post/CommentDialog";
import { useAuthContext } from "@/contexts/AuthContext";
import usePost from "@/hooks/usePost";

interface Props {
  query: string;
}

const PostResults: React.FC<Props> = ({ query }) => {
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openCommentIndex, setOpenCommentIndex] = useState<number | null>(null);
  const { user } = useAuthContext();
  const userId = user?.id || 0;
  const [openingPost, setOpeningPost] = useState<Post | null>(null);

  const { fetchPostById, sharePost } = usePost();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "") return;

      setLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8090/post-service/api/posts/search",
          {
            params: { keyword: query },
          },
        );
        setResults(response.data);
        console.log("Fetched posts:", response.data);
      } catch (error) {
        console.error("Lỗi khi tìm bài post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleImageClick = (postIndex: number, imageIndex: number) => {
    console.log(`Clicked image ${imageIndex} in post ${postIndex}`);
    // Mở lightbox hoặc modal nếu có
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
    <>
      <h2 className="mb-4 text-xl font-bold">Posts</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500 italic">No posts found for "{query}".</p>
      ) : (
        // <ul className="space-y-4">
        //   {results.map((post) => (
        //     <li key={post.id} className="rounded border bg-white p-4 shadow-sm">
        //       <div className="mb-2 flex items-center space-x-3">
        //         {post.author?.avatarUrl && (
        //           <img
        //             src={post.author.avatarUrl}
        //             alt={post.author.fullName}
        //             className="h-10 w-10 rounded-full object-cover"
        //           />
        //         )}
        //         <div>
        //           <p className="font-semibold">
        //             {post.author?.fullName || "Unknown Author"}
        //           </p>
        //           <p className="text-sm text-gray-500">
        //             {new Date(post.createdAt).toLocaleString()}
        //           </p>
        //         </div>
        //       </div>
        //       <p className="text-gray-800">{post.content}</p>
        //       <div className="mt-2 text-sm text-gray-400">
        //         Privacy: {post.privacyLevel || "unknown"} | Status:{" "}
        //         {post.status || "unknown"}
        //       </div>
        //     </li>
        //   ))}
        // </ul>
        <>
          {results.map((post, index) => (
            <>
              <PostItem
                key={post.postId}
                post={post}
                index={index}
                onCommentClick={handleCommentClick}
                onImageClick={handleImageClick}
                onLikeClick={handleLikeClick}
                onShareClick={handleShareClick}
              />

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
            </>
          ))}
        </>
      )}
    </>
  );
};

export default PostResults;
