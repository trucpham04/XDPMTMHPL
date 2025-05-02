"use client";

import React, { useEffect } from "react";
import { useNotificationWebSocketContext } from "@/contexts/NotificationWebSocketContext";
import { NotificationsList } from "@/components/notification/notification-list";
import { toast } from "sonner";
import useNotification from "@/hooks/useNotification";

const NotificationsPage: React.FC = () => {
  const { isConnected, notifications: liveNotifications } =
    useNotificationWebSocketContext();

  const { getNotifications, deleteNotification, loading, notifications } =
    useNotification();

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
  }, []);

  const handleDeleteNotification = async (id: string) => {
    try {
      deleteNotification(id);
    } catch (error) {
      toast.error("Error deleting notification", {
        description: "Please try again later",
      });
      console.log("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      toast.success("Connected to notifications", {
        description: "You'll receive notifications in real-time",
      });
    }
  }, [isConnected]);

  return (
    <div className="container max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] max-w-3xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Notifications</h1>

      <NotificationsList
        notifications={allNotifications}
        onDeleteNotification={handleDeleteNotification}
        isLoading={loading}
      />
    </div>
  );
};

export default NotificationsPage;
