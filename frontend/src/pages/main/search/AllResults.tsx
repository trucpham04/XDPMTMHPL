import React, { useEffect, useState } from "react";
import { User } from "@/API/UserServiceInterface";
// import { fetchUsers } from "@/API/UserService";
import { fetchPosts, Post } from "@/API/PostService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllUsers } from "@/API/UserServiceMock"; 

interface AllResultsProps {
  query: string;
}

const AllResults: React.FC<AllResultsProps> = ({ query }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllUsers(query); // Truyền query vào
      setUsers(result.data); 

      const allPosts = await fetchPosts();
      const filteredPosts = allPosts.filter((post) =>
        post.content.toLowerCase().includes(query.toLowerCase())
      );
      setPosts(filteredPosts);
    };

    fetchData();
  }, [query]);

  const hasUsers = users.length > 0;
  const hasPosts = posts.length > 0;

  if (!hasUsers && !hasPosts) {
    return <p className="text-gray-500">No results found.</p>;
  }

  return (
    <div className="space-y-6">
      {hasUsers && (
        <div>
          <h2 className="text-xl font-bold mb-2">People</h2>
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between">
                <div
                  className="flex cursor-pointer items-center gap-3"
                  onClick={() => {
                    const stored = localStorage.getItem("searchHistory");
                    const prev: User[] = stored ? JSON.parse(stored) : [];
                    const exists = prev.some((u) => u.id === user.id);
                    const updated = exists ? prev : [user, ...prev.slice(0, 7)];
                    localStorage.setItem("searchHistory", JSON.stringify(updated));
                  }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl || ""} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium hover:underline cursor-pointer">{user.name}</p>
                    <p className="text-sm text-gray-500">Friend · X mutual friends</p>
                  </div>
                </div>
                <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white">
                  Message
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasPosts && (
        <div>
          <h2 className="text-xl font-bold mb-2">Posts</h2>
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="border rounded p-3 bg-gray-50">
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AllResults;
