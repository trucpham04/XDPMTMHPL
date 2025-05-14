import { useState, useCallback } from "react";
import { Notification } from "../types/Notification";
import { notificationService } from "@/services/notificationServices";
import { useAuthContext } from "@/contexts/AuthContext";

export const useNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuthContext();

  const getNotifications = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getNotifications(
        user.id.toString(),
      );
      setNotifications(res.notifications);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch notifications");
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const getUnreadCount = useCallback(async () => {
    if (!user?.id) return;

    try {
      const count = await notificationService.getUnreadCount(
        user.id.toString(),
      );
      setUnreadCount(count);
      return count;
    } catch (err: any) {
      console.error("Failed to fetch unread count:", err);
      return 0;
    }
  }, [user?.id]);

  const deleteNotification = useCallback(
    async (notificationId: number) => {
      setLoading(true);
      setError(null);
      try {
        await notificationService.deleteNotification(notificationId.toString());
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        // Update unread count if the deleted notification was unread
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId,
        );
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to delete notification");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [notifications],
  );

  const markAsRead = useCallback(
    async (notificationId: number) => {
      setLoading(true);
      setError(null);
      try {
        await notificationService.markAsRead(notificationId.toString());
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification,
          ),
        );
        // Update unread count
        const markedNotification = notifications.find(
          (n) => n.id === notificationId,
        );
        if (markedNotification && !markedNotification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to mark notification as read");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [notifications],
  );

  return {
    loading,
    error,
    notifications,
    unreadCount,
    getNotifications,
    getUnreadCount,
    deleteNotification,
    markAsRead,
  };
};

export default useNotification;
