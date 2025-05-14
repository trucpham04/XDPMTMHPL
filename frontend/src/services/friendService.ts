import { User } from "@/types/User";
import apiClient from "@/services/apiClient";
import { FriendRequest } from "../types/Friend";

const API_BASE = "friend-service/api/friends";

export const friendService = {
  getFriendRequests: async (): Promise<User[]> => {
    return apiClient.get(`${API_BASE}/requests`);
  },
  getSentRequests: async (): Promise<User[]> => {
    return apiClient.get(`${API_BASE}/requests/allsent`);
  },
  acceptRequest: async (id: number) => {
    return apiClient.post(`${API_BASE}/requests/accept/${id}`);
  },
  deleteRequest: async (id: number) => {
    return apiClient.delete(`${API_BASE}/requests/delete/${id}`);
  },
  cancelRequest: async (id: number) => {
    return apiClient.delete(`${API_BASE}/requests/cancel/${id}`);
  },
  getAllFriends: async (): Promise<User[]> => {
    return apiClient.get(`${API_BASE}`);
  },
  removeFriend: async (id: number) => {
    return apiClient.delete(`${API_BASE}/${id}`);
  },
};

class FriendService {
  /**
   * Lấy danh sách bạn bè
   */
  async getAllFriends(): Promise<User[]> {
    return apiClient.get<User[]>(`${API_BASE}`);
  }

  /**
   * Gửi lời mời kết bạn
   */
  async sendFriendRequest(receiverId: number): Promise<FriendRequest> {
    return apiClient.post<FriendRequest>(`${API_BASE}/requests/${receiverId}`);
  }

  /**
   * Lấy tất cả lời mời kết bạn nhận được
   */
  async getAllFriendRequests(): Promise<User[]> {
    return apiClient.get<User[]>(`${API_BASE}/requests`);
  }

  /**
   * Lấy tất cả lời mời đã gửi
   */
  async getAllRequestsSent(): Promise<User[]> {
    return apiClient.get<User[]>(`${API_BASE}/requests/allsent`);
  }

  /**
   * Chấp nhận lời mời kết bạn
   */
  async acceptFriendRequest(senderId: number): Promise<void> {
    return apiClient.post<void>(`${API_BASE}/requests/accept/${senderId}`);
  }

  /**
   * Hủy lời mời kết bạn
   */
  async removeFriendRequest(senderId: number): Promise<void> {
    return apiClient.delete<void>(`${API_BASE}/requests/delete/${senderId}`);
  }
}

export default new FriendService();
