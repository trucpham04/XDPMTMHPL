export type MessagesSidebarItemType = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessages: number;
};

export interface MessagesMainItemType {
  id?: string | number; // Unique identifier for the message
  sender_id: number; // ID of the user who sent the message
  content: string; // The actual message content
  timestamp?: string; // When the message was sent
  read?: boolean; // Whether the message has been read
  // Possibly other fields like:
  attachment?: {
    type: string; // e.g., "image", "file", "video"
    url: string; // URL to the attachment
    name?: string; // Name of the attachment
  }[];
}
