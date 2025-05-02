import { User, UpdateUserRequest } from "@/types/User";
import apiClient from "./apiClient";

const serviceName = "user-service";

class UserService {
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(`${serviceName}/api/users/me`);
  }

  async updateUserProfile(data: UpdateUserRequest): Promise<User> {
    return apiClient.put<User>(`${serviceName}/api/users/me`, data);
  }

  async getUserById(id: number): Promise<User> {
    return apiClient.get<User>(`${serviceName}/api/users/${id}`);
  }
}

const userService = new UserService();
export default userService;
