import { NotificationResponse } from "../types/Notification";
import apiClient from "./apiClient";

const serviceName = "notification-service";

class NotificationService {
  /**
   * Lấy danh sách thông báo
   */
  async getNotifications(): Promise<NotificationResponse> {
    return apiClient.get<NotificationResponse>(
      `${serviceName}/api/notifications?userId=1`,
    );
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
