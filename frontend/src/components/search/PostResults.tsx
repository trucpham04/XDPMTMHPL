import React, { useEffect, useState } from "react";
import axios from "axios";

interface Author {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  fullName: string;
}

interface Post {
  id: number;
  content?: string | null;
  privacyLevel?: string | null;
  status?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: Author | null;
}

interface Props {
  query: string;
}

const PostResults: React.FC<Props> = ({ query }) => {
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "") return;

      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8090/search-service/api/post/search/posts",
          {
            params: { query },
          },
        );
        setResults(response.data);
      } catch (error) {
        console.error("Lỗi khi tìm bài post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <>
      <h2 className="mb-4 text-xl font-bold">Posts</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500 italic">No posts found for "{query}".</p>
      ) : (
        <ul className="space-y-4">
          {results.map((post) => (
            <li key={post.id} className="rounded border bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center space-x-3">
                {post.author?.avatarUrl && (
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.fullName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">
                    {post.author?.fullName || "Unknown Author"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-800">{post.content}</p>
              <div className="mt-2 text-sm text-gray-400">
                Privacy: {post.privacyLevel || "unknown"} | Status:{" "}
                {post.status || "unknown"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default PostResults;
