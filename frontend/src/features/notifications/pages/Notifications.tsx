"use client";

import React, { useState, useEffect } from "react";
import { useNotificationWebSocket } from "../hooks/useNotificationWebSocket";
import { NotificationService } from "../services/notificationServices";
import { NotificationsList } from "../components/notification-list";
import { Notification } from "../types/notification";
import { toast } from "sonner";

const WEBSOCKET_URL = "ws://localhost:3000";

const NotificationsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [storedNotifications, setStoredNotifications] = useState<
    Notification[]
  >([]);

  // Connect to WebSocket for real-time notifications
  const { notifications: liveNotifications, isConnected } =
    useNotificationWebSocket(WEBSOCKET_URL);

  // Combine stored and live notifications, remove duplicates
  const allNotifications = [...liveNotifications, ...storedNotifications]
    .filter(
      (notification, index, self) =>
        index === self.findIndex((n) => n.id === notification.id),
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  // Fetch initial notifications
  useEffect(() => {
    async function fetchNotifications() {
      try {
        setIsLoading(true);
        const data = await NotificationService.getNotifications();
        setStoredNotifications(data);
      } catch (error) {
        toast.error("Failed to fetch notifications", {
          description: "Please try again later",
        });
        console.log("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  // Handle marking a notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setStoredNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    } catch (error) {
      toast.error("Error marking notification as read", {
        description: "Please try again later",
      });
      console.log("Error marking notification as read:", error);
    }
  };

  // Handle deleting a notification
  const handleDeleteNotification = async (id: string) => {
    try {
      await NotificationService.deleteNotification(id);
      setStoredNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id),
      );
    } catch (error) {
      toast.error("Error deleting notification", {
        description: "Please try again later",
      });
      console.log("Error deleting notification:", error);
    }
  };

  // Handle accepting a friend request
  const handleAcceptFriendRequest = async (id: string) => {
    try {
      // Assuming there's an API endpoint for accepting friend requests
      const response = await fetch(`/api/friend-requests/${id}/accept`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to accept friend request");
      }

      // Mark the notification as read
      await handleMarkAsRead(id);

      toast.success("Friend request accepted", {
        description: "You are now friends!",
      });
    } catch (error) {
      toast.error("Error accepting friend request", {
        description: "Please try again later",
      });
      console.log("Error accepting friend request:", error);
    }
  };

  // Handle declining a friend request
  const handleDeclineFriendRequest = async (id: string) => {
    try {
      // Assuming there's an API endpoint for declining friend requests
      const response = await fetch(`/api/friend-requests/${id}/decline`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to decline friend request");
      }

      // Mark the notification as read and potentially delete it
      await handleDeleteNotification(id);

      toast("Friend request declined");
    } catch (error) {
      toast.error("Error declining friend request", {
        description: "Please try again later",
      });
      console.log("Error declining friend request:", error);
    }
  };

  // WebSocket connection status indicator
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
        onMarkAsRead={handleMarkAsRead}
        onDeleteNotification={handleDeleteNotification}
        onAcceptFriendRequest={handleAcceptFriendRequest}
        onDeclineFriendRequest={handleDeclineFriendRequest}
        isLoading={isLoading}
      />
    </div>
  );
};

export default NotificationsPage;
