import { NotificationResponse } from "../types/Notification";
import apiClient from "./apiClient";

const serviceName = "notification-service";

class NotificationService {
  /**
   * Get list of notifications for a user
   */
  async getNotifications(userId: string): Promise<NotificationResponse> {
    return apiClient.get<NotificationResponse>(
      `${serviceName}/api/notifications?userId=${userId}`,
    );
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    return apiClient.delete<void>(
      `${serviceName}/api/notifications/${notificationId}`,
    );
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    return apiClient.post<void>(
      `${serviceName}/api/notifications/${notificationId}/read`,
    );
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return apiClient.get<number>(
      `${serviceName}/api/notifications/unread/count?userId=${userId}`,
    );
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    return apiClient.post<void>(
      `${serviceName}/api/notifications/read/all?userId=${userId}`,
    );
  }
}

export const notificationService = new NotificationService();
export default notificationService;
