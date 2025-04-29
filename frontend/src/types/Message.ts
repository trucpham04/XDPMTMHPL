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
}

export interface UserDTO {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
}
