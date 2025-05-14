"use client";

import React, { useEffect } from "react";
import { useNotificationWebSocketContext } from "@/contexts/NotificationWebSocketContext";
import { NotificationsList } from "@/components/notification/notification-list";
import { toast } from "sonner";
import useNotification from "@/hooks/useNotification";

const NotificationsPage: React.FC = () => {
  const { notifications: liveNotifications } =
    useNotificationWebSocketContext();

  const {
    getNotifications,
    deleteNotification,
    markAsRead,
    loading,
    notifications,
  } = useNotification();

  const allNotifications = [...liveNotifications, ...notifications]
    .filter(
      (notification, index, self) =>
        index === self.findIndex((n) => n.id === notification.id),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const handleDeleteNotification = async (id: number) => {
    try {
      await deleteNotification(id);
      toast.success("Đã xóa thông báo thành công");
    } catch (error) {
      toast.error("Lỗi xóa thông báo", {
        description: "Vui lòng thử lại sau",
      });
      console.error("Error deleting notification:", error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
    } catch (error) {
      toast.error("Lỗi đánh dấu thông báo đã đọc", {
        description: "Vui lòng thử lại sau",
      });
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="container max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] max-w-3xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Thông báo</h1>

      <NotificationsList
        notifications={allNotifications}
        onDeleteNotification={handleDeleteNotification}
        onMarkAsRead={handleMarkAsRead}
        isLoading={loading}
      />
    </div>
  );
};

export default NotificationsPage;
