import { useState } from "react";
import axios from "axios";
import { User } from "@/types/User";

export const useFriends = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFriends = async (userId: number): Promise<User[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8090/friend-service/api/friends/user/${userId}`,
        { withCredentials: true },
      );
      return response.data;
    } catch (err) {
      setError("Failed to fetch friends");
      console.error("Error fetching friends:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    getFriends,
    loading,
    error,
  };
};
