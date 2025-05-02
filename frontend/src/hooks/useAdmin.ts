import { useState, useCallback } from "react";
import {
  AdminService,
  GetAllUsersResponse,
  NewUserAdminRequest,
  UpdateUserAdminRequest,
} from "@/services/adminService";

export const useAdmin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<GetAllUsersResponse>();
  const [searchResults, setSearchResults] =
    useState<GetAllUsersResponse | null>(null);

  const adminService = new AdminService();

  // Fetch all users
  const fetchUsers = useCallback(async (page?: number, size?: number) => {
    setLoading(true);
    setError(null);
    try {
      const usersList = await adminService.getAllUsers(page, size);
      setUsers(usersList);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchUsers = useCallback(
    async (keyword: string, page: number = 0, size: number = 25) => {
      setLoading(true);
      setError(null);
      try {
        const result = await adminService.searchUsers(keyword, page, size);
        setSearchResults(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to search users";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Add new user
  const addNewUser = useCallback(
    async (userData: NewUserAdminRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await adminService.addNewUser(userData);
        await fetchUsers();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add user";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers],
  );

  // Update user
  const updateUser = useCallback(
    async (
      userId: number,
      userData: UpdateUserAdminRequest,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await adminService.updateUser(userId, userData);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update user";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const toggleUserStatus = useCallback(
    async (userId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await adminService.toggleUserStatus(userId);
        await fetchUsers();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to toggle user status";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers],
  );

  return {
    loading,
    error,
    users,
    searchResults,
    addNewUser,
    updateUser,
    toggleUserStatus,
    fetchUsers,
    searchUsers,
  };
};

export default useAdmin;
