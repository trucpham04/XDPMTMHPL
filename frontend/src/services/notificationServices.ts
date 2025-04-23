import { Notification } from "../types/Notification";

const API_URL = "http://localhost:3000/api";

export const NotificationService = {
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        credentials: "include", // for sending cookies with the request
      });

      if (!response.ok) {
        throw new Error(`Error fetching notifications: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      throw error;
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Error marking notification as read: ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error marking all notifications as read: ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  },

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Error deleting notification: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      throw error;
    }
  },
};
