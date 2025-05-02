import { User } from "@/types/User";
import { apiClient } from "./apiClient";
import { MessageResponse } from "@/types/Response";

const serviceName = "user-service";

export interface AuthResponse {
  token: string;
  type: "Bearer";
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  roles: string[];
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      serviceName + "/api/auth/register",
      userData,
    );
    return response;
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      serviceName + "/api/auth/login",
      credentials,
    );
    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post(serviceName + "/api/auth/logout");
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(serviceName + "/api/users/me");
    return response;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userData: Partial<User>,
    userId: number,
  ): Promise<MessageResponse> {
    const response = await apiClient.put<MessageResponse>(
      serviceName + `/api/auth/users/${userId}`,
      userData,
    );
    return response;
  }
}

export const authService = new AuthService();
export default authService;
