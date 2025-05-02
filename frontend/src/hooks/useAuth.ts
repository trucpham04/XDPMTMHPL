import authService, {
  LoginRequest,
  RegisterRequest,
} from "@/services/authService";
import { User } from "@/types/User";
import { useState, useEffect, useCallback } from "react";

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Fetch user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();

        if (user) setUser(user);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Register user
  const register = useCallback(
    async (userData: RegisterRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await authService.register(userData);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Login user
  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await authService.login(credentials);
        const me = await authService.getCurrentUser();
        setUser(me);
        // setIsAuthenticated(true);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Logout user
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  // Update user profile
  const updateProfile = useCallback(
    async (
      userData: {
        firstName: string;
        lastName: string;
        email: string;
        bio: string;
        profilePictureUrl: string;
      },
      userId: number,
    ) => {
      setLoading(true);
      setError(null);
      try {
        await authService.updateProfile(userData, userId);
        await authService.getCurrentUser();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Update failed";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    user,
    setUser,
    register,
    login,
    logout,
    updateProfile,
  };
};

export default useAuth;
