import { useState, useEffect, useRef } from "react";
import { Notification } from "../types/Notification";

export default function useNotificationWebSocket(url: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  // Connect to WebSocket
  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket(`${url}/notifications`);
    socketRef.current = socket;

    // Connection opened
    socket.addEventListener("open", () => {
      console.log("Notification WebSocket connection established");
      setIsConnected(true);
    });

    // Listen for notifications
    socket.addEventListener("message", (event) => {
      try {
        const notificationData: Notification = JSON.parse(event.data);
        setNotifications((prevNotifications) => [
          notificationData,
          ...prevNotifications,
        ]);

        if (!notificationData.isRead) {
          setUnreadCount((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error parsing WebSocket notification:", error);
      }
    });

    // Connection closed
    socket.addEventListener("close", () => {
      console.log("Notification WebSocket connection closed");
      setIsConnected(false);
    });

    // Connection error
    socket.addEventListener("error", (error) => {
      console.error("Notification WebSocket error:", error);
      setIsConnected(false);
    });

    // Clean up on unmount
    return () => {
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };
  }, [url]);

  return { notifications, unreadCount, isConnected };
}
