import { User } from "./User";

export type NotificationType =
  | "FRIEND_REQUEST"
  | "FRIEND_REQUEST_ACCEPTED"
  | "POST_LIKE"
  | "POST_COMMENT"
  | "NEW_MESSAGE";

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
}

export interface NotificationResponse {
  notifications: Notification[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
}
