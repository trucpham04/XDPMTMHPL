import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { User } from "@/types/User";
import { Post } from "@/types/Post";
import { PostItem } from "../post/PostItem";
import { CommentDialog } from "../post/CommentDialog";
import { useAuthContext } from "@/contexts/AuthContext";
import usePost from "@/hooks/usePost";

interface AllResultsProps {
  query: string;
  currentUserId: number;
}

const AllResults: React.FC<AllResultsProps> = ({ query, currentUserId }) => {
  const [users, setUsers] = useState<(User & { relationStatus: string })[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openCommentIndex, setOpenCommentIndex] = useState<number | null>(null);
  const { user } = useAuthContext();
  const userId = user?.id || 0;
  const [openingPost, setOpeningPost] = useState<Post | null>(null);

  const { fetchPostById, sharePost } = usePost();
  useEffect(() => {
    setUsers([]);
    setPosts([]);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [usersRes, postsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8090/user-service/api/users/search", {
            params: { query, currentUserId },
          }),
          axios.get("http://127.0.0.1:8090/post-service/api/posts/search", {
            params: { keyword: query },
          }),
        ]);

        setUsers(usersRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, currentUserId]);

  const handleUserClick = async (user: User) => {
    try {
      await axios.post(
        "http://127.0.0.1:8090/search-service/api/search/history",
        null,
        {
          params: {
            searcherId: currentUserId,
            targetUserId: user.id,
            searchText: `${user.firstName} ${user.lastName}`,
          },
        },
      );
      console.log("✅ Đã lưu lịch sử tìm kiếm:", {
        searcherId: currentUserId,
        targetUserId: user.id,
        name: `${user.firstName} ${user.lastName}`,
      });
    } catch (error) {
      console.error("❌ Lỗi khi lưu lịch sử:", error);
    }
  };

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
                    <AvatarImage src={user.profilePictureUrl || ""} />
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
                    {/* <p className="text-sm text-gray-500">
                      {user.relationStatus === "FRIEND" ? "Friend" : ""}
                    </p> */}
                  </div>
                </div>
                {/* {renderButton(user.relationStatus)} */}
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
