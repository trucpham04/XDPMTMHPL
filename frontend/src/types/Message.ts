import { User } from "./User";

export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "FILE"; // hoặc tùy theo enum trong Java

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderUsername?: string; // fetched from user service
  messageType: MessageType;
  content: string;
  mediaUrl?: string;
  status: string;
  timestamp: string; // ISO string format, nếu dùng `LocalDateTime` từ Java
}

export interface ConversationCreateRequest {
  name: string;
  groupChat: boolean;
  participantIds: number[];
}

export interface Conversation {
  id: number;
  name: string;
  isGroupChat: boolean;
  createdAt: string; // ISO string format
  participantIds: number[];
  otherUser: User; // thông tin người dùng khác trong nhóm chat
  lastMessage: ChatMessage; // tin nhắn cuối cùng trong cuộc trò chuyện
}

export interface UserDTO {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
}
