import React, { useEffect, useState } from "react";
import { fetchPosts } from "@/API/PostService"; // dùng mock


export const fetchpost = async (): Promise<Post[]> => {
  const result = await fetchPosts(); // ✅ Không cần truyền tham số
  return result; // ✅ Loại bỏ dấu chấm thừa
};


interface Post {
  id: number;
  content: string;
}

interface Props {
  query: string;
}

const PostResults: React.FC<Props> = ({ query }) => {
  const [results, setResults] = useState<Post[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const allPosts = await fetchPosts();
      const filtered = allPosts.filter((post) =>
        post.content.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    };
    fetchResults();
  }, [query]);

  return (
    <>
      <h2 className="mb-4 text-xl font-bold">Posts</h2>
      {results.length === 0 ? (
        <p className="text-gray-500 italic">
          No posts found for "{query}".
        </p>
      ) : (
        <ul className="space-y-4">
          {results.map((post) => (
            <li key={post.id} className="p-3 border rounded">
              {post.content}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default PostResults;

// Dữ liệu giả lập
// export const fetchPosts = async (): Promise<Post[]> => {
//   return [
//     { id: 1, content: "Learning React is fun!" },
//     { id: 2, content: "Alice is amazing!" },
//     { id: 3, content: "David  loves coding" },
//     { id: 4, content: "React and TypeScript FTW" },
//     { id: 5, content: "Hoàng Traaung's post about travel" },
//     { id: 6, content: "Just chilling today..." },
//   ];
// };
