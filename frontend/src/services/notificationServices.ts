import { Notification } from "../types/Notification";
import apiClient from "./apiClient";

const serviceName = "notification-service";

class NotificationService {
  /**
   * Lấy danh sách thông báo
   */
  async getNotifications(): Promise<Notification[]> {
    return apiClient.get<Notification[]>(`${serviceName}/api/notifications`);
  }

  /**
   * Đánh dấu một thông báo là đã đọc
   */
  async markAsRead(notificationId: string): Promise<void> {
    return apiClient.put<void>(
      `${serviceName}/api/notifications/${notificationId}/read`,
    );
  }

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  async markAllAsRead(): Promise<void> {
    return apiClient.put<void>(`${serviceName}/api/notifications/read-all`);
  }

  /**
   * Xóa một thông báo
   */
  async deleteNotification(notificationId: string): Promise<void> {
    return apiClient.delete<void>(
      `${serviceName}/api/notifications/${notificationId}`,
    );
  }
}

export const notificationService = new NotificationService();
export default notificationService;
