import { useState, useEffect, useCallback, useRef } from "react";
import { MessagesMainItemType } from "../types/messages-sidebar-item-type";

interface UseWebSocketProps {
  url: string;
  conversationId?: string | number;
}

export function useWebSocket({ url, conversationId }: UseWebSocketProps) {
  const [messages, setMessages] = useState<MessagesMainItemType[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  // Connect to WebSocket
  useEffect(() => {
    if (!conversationId) return;

    // Create WebSocket connection
    const socket = new WebSocket(`${url}/conversations/${conversationId}`);
    socketRef.current = socket;

    // Connection opened
    socket.addEventListener("open", () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      try {
        const messageData = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, messageData]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    // Connection closed
    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    });

    // Connection error
    socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
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
  }, [url, conversationId]);

  // Function to send message
  const sendMessage = useCallback((content: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          content,
          timestamp: new Date().toISOString(),
        }),
      );
    } else {
      console.error("WebSocket is not connected");
    }
  }, []);

  return { messages, isConnected, sendMessage };
}
