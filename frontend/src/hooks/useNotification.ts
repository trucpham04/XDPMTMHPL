import { useState, useCallback } from "react";
import { Notification } from "../types/Notification";
import notificationService from "@/services/notificationServices";

export const useNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Lấy danh sách thông báo
  const getNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch notifications");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Đánh dấu thông báo là đã đọc
  const markAsRead = useCallback(async (notificationId: string) => {
    setLoading(true);
    setError(null);
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to mark notification as read");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Đánh dấu tất cả là đã đọc
  const markAllAsRead = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to mark all notifications as read");
      return false;
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
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};

export default useNotification;
