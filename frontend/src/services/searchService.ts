import { User } from "@/types/User";
import { Post } from "@/types/Post";
import apiClient from "@/services/apiClient";

const USER_SEARCH_API = "user-service/api/users/search";
const POST_SEARCH_API = "post-service/api/posts/search";
const SEARCH_HISTORY_API = "search-service/api/search/history";

export const searchService = {
  searchUsers: async (
    query: string,
    currentUserId: number,
  ): Promise<User[]> => {
    return apiClient.get(USER_SEARCH_API, { params: { query, currentUserId } });
  },
  searchPosts: async (query: string): Promise<Post[]> => {
    return apiClient.get(POST_SEARCH_API, { params: { keyword: query } });
  },
  saveSearchHistory: async (
    searcherId: number,
    targetUserId: number,
    searchText: string,
  ) => {
    return apiClient.post(
      SEARCH_HISTORY_API,
      {},
      {
        params: { searcherId, targetUserId, searchText },
      },
    );
  },
};
