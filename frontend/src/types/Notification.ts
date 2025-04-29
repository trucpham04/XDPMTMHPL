import { User } from "./User";

export type NotificationType =
  | "FRIEND_REQUEST"
  | "FRIEND_ACCEPT"
  | "POST_LIKE"
  | "POST_COMMENT"
  | "NEW_MESSAGE";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: string;
  sender: User;
}

export interface NotificationResponse {
  notifications: Notification[];
  currentPage: number;
  hasNext: boolean;
  length: number;
  totalElements: number;
  totalPages: number;
}
