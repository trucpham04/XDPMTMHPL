import { useCallback, useState } from "react";
import { searchService } from "@/services/searchService";
import { User } from "@/types/User";
import { Post } from "@/types/Post";

export function useSearch() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = useCallback(
    async (query: string, currentUserId: number) => {
      setLoading(true);
      try {
        const data = await searchService.searchUsers(query, currentUserId);
        setUsers(data);
        setError(null);
      } catch (err) {
        setError("Không thể tìm kiếm người dùng.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const searchPosts = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const data = await searchService.searchPosts(query);
      setPosts(data);
      setError(null);
    } catch (err) {
      setError("Không thể tìm kiếm bài viết.");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSearchHistory = useCallback(
    async (searcherId: number, targetUserId: number, searchText: string) => {
      try {
        await searchService.saveSearchHistory(
          searcherId,
          targetUserId,
          searchText,
        );
      } catch (err) {
        // Optionally handle error
      }
    },
    [],
  );

  return {
    users,
    posts,
    loading,
    error,
    searchUsers,
    searchPosts,
    saveSearchHistory,
  };
}
