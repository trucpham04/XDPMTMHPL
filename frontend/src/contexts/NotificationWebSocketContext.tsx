// NotificationWebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Notification } from "@/types/Notification";
import { useAuthContext } from "./AuthContext";

interface NotificationWebSocketContextType {
  isConnected: boolean;
  notifications: Notification[];
  markAsRead: (notificationId: number) => void;
}

const NotificationWebSocketContext =
  createContext<NotificationWebSocketContextType>({
    isConnected: false,
    notifications: [],
    markAsRead: () => {},
  });

export const useNotificationWebSocketContext = () =>
  useContext(NotificationWebSocketContext);

export const NotificationWebSocketProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user?.id) return;

    const ws = new WebSocket(
      `ws://127.0.0.1:8090/notification-service/ws/notifications?userId=${user.id}`,
    );

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", {
        data: event.data,
        type: event.type,
        timeStamp: event.timeStamp,
        lastEventId: event.lastEventId,
        origin: event.origin,
      });
      try {
        const notification: Notification = JSON.parse(event.data);
        console.log("Parsed notification:", notification);
        setNotifications((prev) => [notification, ...prev]);

        // Show toast based on notification type
        switch (notification.type) {
          case "FRIEND_REQUEST":
            console.log("Processing FRIEND_REQUEST notification");
            toast.info("New Friend Request", {
              description: `${notification.sender?.firstName} ${notification.sender?.lastName} sent you a friend request`,
            });
            break;
          case "FRIEND_REQUEST_ACCEPTED":
            toast.info("Friend Request Accepted", {
              description: `${notification.sender?.firstName} ${notification.sender?.lastName} accepted your friend request`,
            });
            console.log(notification);
            break;
          case "POST_LIKE":
            toast.info("New Like", {
              description: `${notification.sender?.firstName} ${notification.sender?.lastName} liked your post`,
            });
            break;
          case "POST_COMMENT":
            toast.info("New Comment", {
              description: `${notification.sender?.firstName} ${notification.sender?.lastName} commented on your post`,
            });
            break;
          case "NEW_MESSAGE":
            toast.info("New Message", {
              description: `${notification.sender?.firstName} ${notification.sender?.lastName} sent you a message`,
            });
            break;
          default:
            toast.info(notification.title || "New Notification", {
              description: notification.message,
            });
        }
      } catch (error) {
        console.error("Error parsing notification:", error);
        toast.error("Error processing notification", {
          description: "There was an error processing the notification",
        });
      }
    };

    ws.onclose = () => {
      console.log("Notification WebSocket disconnected");
      setIsConnected(false);
      toast.error("Disconnected from notifications", {
        description: "Please refresh the page to reconnect",
      });
    };

    ws.onerror = (error) => {
      console.error("Notification WebSocket error:", error);
      setIsConnected(false);
      toast.error("Connection error", {
        description: "Failed to connect to notification service",
      });
    };

    setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user?.id]);

  const markAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  return (
    <NotificationWebSocketContext.Provider
      value={{ isConnected, notifications, markAsRead }}
    >
      {children}
    </NotificationWebSocketContext.Provider>
  );
};
