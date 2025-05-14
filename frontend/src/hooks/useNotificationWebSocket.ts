import { useState, useEffect, useRef, useCallback } from "react";
import { Notification } from "../types/Notification";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthContext";

export const useNotificationWebSocket = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const { user } = useAuthContext();
  const userId = user?.id;
  const url = "ws://localhost:8090/notification-service/ws/notification";

  const connect = useCallback(() => {
    if (!userId) return;
    const connectionUrl = `${url}?user_id=${userId}`;

    const socket = new WebSocket(connectionUrl);
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      console.log("Notification WebSocket connection established");
      setIsConnected(true);
      setIsConnected(true);
    });

    socket.addEventListener("message", (event) => {
      try {
        const notificationData: Notification = JSON.parse(event.data);

        setNotifications((prevNotifications) => [
          notificationData,
          ...prevNotifications,
        ]);

        if (notificationData.type === "FRIEND_REQUEST")
          toast.info("You have a new friend request", {
            description: `${notificationData.sender?.fullName} sent you a friend request.`,
          });

        if (notificationData.type === "NEW_MESSAGE")
          toast.info("You have a new message", {
            description: `${notificationData.sender?.fullName} sent you a message.`,
          });

        if (notificationData.type === "POST_LIKE")
          toast.info("Someone liked your post", {
            description: `${notificationData.sender?.fullName} liked your post.`,
          });

        if (notificationData.type === "POST_COMMENT")
          toast.info("Someone commented on your post", {
            description: `${notificationData.sender?.fullName} commented on your post.`,
          });
      } catch (error) {
        console.error("Error parsing WebSocket notification:", error);
      }
    });

    socket.addEventListener("close", () => {
      console.log("Notification WebSocket connection closed");
      setIsConnected(false);
      setIsConnected(false);
    });

    socket.addEventListener("error", (error) => {
      console.error("Notification WebSocket error:", error);
      setIsConnected(false);
    });
  }, [user, userId]);

  useEffect(() => {
    connect();

    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close();
      }
    };
  }, [connect, userId]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === Number(notificationId)
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
    setUnreadCount((prev) => prev - 1);
  };

  return { notifications, unreadCount, isConnected, markAsRead };
};

export default useNotificationWebSocket;
