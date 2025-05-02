import { User } from "@/types/User";
import { FriendRequest } from "../types/Friend";
import apiClient from "./apiClient";

const serviceName = "friend-service";

class FriendService {
  /**
   * Lấy danh sách bạn bè
   */
  async getAllFriends(): Promise<User[]> {
    return apiClient.get<User[]>(`${serviceName}/api/friends`);
  }

  /**
   * Gửi lời mời kết bạn
   */
  async sendFriendRequest(receiverId: number): Promise<FriendRequest> {
    return apiClient.post<FriendRequest>(
      `${serviceName}/api/friends/requests/${receiverId}`,
    );
  }

  /**
   * Xoá bạn
   */
  async removeFriend(user2Id: number): Promise<void> {
    return apiClient.delete<void>(`${serviceName}/api/friends/${user2Id}`);
  }

  /**
   * Lấy tất cả lời mời kết bạn nhận được
   */
  async getAllFriendRequests(): Promise<User[]> {
    return apiClient.get<User[]>(`${serviceName}/api/friends/requests`);
  }

  /**
   * Lấy tất cả lời mời đã gửi
   */
  async getAllRequestsSent(): Promise<User[]> {
    return apiClient.get<User[]>(`${serviceName}/api/friends/requests/allsent`);
  }

  /**
   * Chấp nhận lời mời kết bạn
   */
  async acceptFriendRequest(senderId: number): Promise<void> {
    return apiClient.post<void>(
      `${serviceName}/api/friends/requests/accept/${senderId}`,
    );
  }

  /**
   * Hủy lời mời kết bạn
   */
  async removeFriendRequest(senderId: number): Promise<void> {
    return apiClient.delete<void>(
      `${serviceName}/api/friends/requests/delete/${senderId}`,
    );
  }
}

export const friendService = new FriendService();
export default friendService;
