export type NotificationType =
  | "message"
  | "comment"
  | "like"
  | "friend_request";

export interface Notification {
  id: string;
  type: NotificationType;
  content: string;
  timestamp: string;
  isRead: boolean;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  targetId?: string; // ID of the post, comment, etc.
  targetType?: string; // Type of the target (post, comment, etc.)
  data?: any; // Additional data specific to notification type
}
