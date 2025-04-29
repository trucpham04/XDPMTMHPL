import { useState, useCallback } from "react";
import { Notification } from "../types/Notification";
import notificationService from "@/services/notificationServices";

export const useNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getNotifications();

      setNotifications(res.notifications);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch notifications");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Xóa một thông báo
  const deleteNotification = useCallback(async (notificationId: string) => {
    setLoading(true);
    setError(null);
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete notification");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    notifications,
    getNotifications,
    deleteNotification,
  };
};

export default useNotification;
