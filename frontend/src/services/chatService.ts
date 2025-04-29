import { apiClient } from "./apiClient";
import {
  ChatMessage,
  Conversation,
  ConversationCreateRequest,
} from "../types/Message";

const serviceName = "message-service";

class ChatService {
  /**
   * Lấy tất cả cuộc trò chuyện của người dùng
   */
  async getUserConversations(userId: number): Promise<Conversation[]> {
    return apiClient.get<Conversation[]>(
      `${serviceName}/api/chat/conversations/${userId}`,
    );
  }

  /**
   * Tạo cuộc trò chuyện mới
   */
  async createConversation(
    requestData: ConversationCreateRequest,
  ): Promise<Conversation> {
    return apiClient.post<Conversation>(
      `${serviceName}/api/chat/conversations`,
      requestData,
    );
  }

  /**
   * Lấy danh sách tin nhắn của một cuộc trò chuyện
   */
  async getConversationMessages(
    conversationId: number,
  ): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>(
      `${serviceName}/api/chat/conversations/${conversationId}/messages`,
    );
  }

  /**
   * Cập nhật trạng thái của tin nhắn
   */
  async updateMessageStatus(messageId: number, status: string): Promise<null> {
    return apiClient.patch<null>(
      `${serviceName}/api/chat/messages/${messageId}/status`,
      {
        status,
      },
    );
  }

  /**
   * Kiểm tra người dùng có trong cuộc trò chuyện không
   */
  async isUserInConversation(
    conversationId: number,
    userId: number,
  ): Promise<boolean> {
    return apiClient.get<boolean>(
      `${serviceName}/api/chat/conversations/${conversationId}/users/${userId}`,
    );
  }
}

export const chatService = new ChatService();
export default chatService;
