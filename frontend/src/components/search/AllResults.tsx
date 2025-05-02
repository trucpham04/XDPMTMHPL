import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { User } from "@/types/User";
import { Post } from "@/types/Post";

interface AllResultsProps {
  query: string;
  currentUserId: number;
}

const AllResults: React.FC<AllResultsProps> = ({ query, currentUserId }) => {
  const [users, setUsers] = useState<(User & { relationStatus: string })[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        const [usersRes] = await Promise.all([
          axios.get("http://127.0.0.1:8090/user-service/api/users/search", {
            params: { query, currentUserId },
          }),
          // axios.get(
          //   "http://127.0.0.1:8090/search-service/api/post/search/posts",
          //   {
          //     params: { query },
          //   },
          // ),
        ]);

        setUsers(usersRes.data);
        // setPosts(postsRes.data);
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
            searcherId: currentUserId, // 👈 người đang đăng nhập
            targetUserId: user.id, // 👈 người được click vào
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

  // const renderButton = (status: string) => {
  //   switch (status) {
  //     case "FRIEND":
  //       return (
  //         <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white">
  //           Message
  //         </button>
  //       );
  //     case "NOT_FRIEND":
  //       return (
  //         <button className="rounded bg-green-500 px-3 py-1 text-sm text-white">
  //           Add Friend
  //         </button>
  //       );
  //     case "REQUEST_SENT":
  //       return (
  //         <button className="rounded bg-yellow-500 px-3 py-1 text-sm text-white">
  //           Cancel Request
  //         </button>
  //       );
  //     case "REQUEST_RECEIVED":
  //       return (
  //         <button className="rounded bg-indigo-500 px-3 py-1 text-sm text-white">
  //           Accept
  //         </button>
  //       );
  //     default:
  //       return null;
  //   }
  // };

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
            {posts.map((post) => (
              <li
                key={post.id}
                className="rounded border bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-3">
                  {post.user?.profilePicture && (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.user.profilePicture} />
                      <AvatarFallback>
                        {post.user.firstName[0]}
                        {post.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="font-medium">
                      {post.user?.firstName} {post.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800">{post.content}</p>
                {/* <div className="mt-2 text-sm text-gray-400">
                  Privacy: {post.privacyLevel || "unknown"} | Status:{" "}
                  {post.status || "unknown"}
                </div> */}
              </li>
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
