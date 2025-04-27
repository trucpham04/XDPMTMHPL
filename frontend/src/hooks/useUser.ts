import { useState, useCallback } from "react";
import userService from "@/services/userService";
import { User, UpdateUserRequest } from "@/types/User";
import { MessageResponse } from "@/types/Response";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getCurrentUser();
      setUser(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch current user");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (data: UpdateUserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res: MessageResponse = await userService.updateUserProfile(data);
      // await getCurrentUser(); // Refresh user after update
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to update user");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await userService.getUserById(id);
    } catch (err: any) {
      setError(err.message || `Failed to fetch user with id ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    getCurrentUser,
    updateUserProfile,
    getUserById,
  };
};
