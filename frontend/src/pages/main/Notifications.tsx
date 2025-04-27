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

  // Combine stored and live notifications, remove duplicates
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
        onAcceptFriendRequest={handleAcceptFriendRequest}
        onDeclineFriendRequest={handleDeclineFriendRequest}
        isLoading={loading}
      />
    </div>
  );
};

export default NotificationsPage;
