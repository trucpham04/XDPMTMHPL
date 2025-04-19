import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessage } from "../types";

interface UseWebSocketProps {
  url: string;
  userId?: number;
}

export function useWebSocket({ url, userId }: UseWebSocketProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const currentConversationIdRef = useRef<string | number | null>(null);

  // Connect to WebSocket - only once
  useEffect(() => {
    // Append username as query parameter
    const connectionUrl = `${url}?user_id=${userId}`;

    // Create WebSocket connection
    const socket = new WebSocket(connectionUrl);
    socketRef.current = socket;

    // Connection opened
    socket.addEventListener("open", () => {
      console.log("WebSocket connection established");
      setIsConnected(true);

      // If we already have a conversation ID when connection opens, join it
      if (currentConversationIdRef.current) {
        joinConversation(currentConversationIdRef.current);
      }
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      try {
        const messageData = JSON.parse(event.data);

        // Check if it's an error message
        if (messageData.type === "ERROR") {
          console.error("WebSocket error from server:", messageData.message);
          return;
        }

        // Check if it's a join confirmation
        if (messageData.type === "JOIN_CONFIRMATION") {
          console.log(
            `Successfully joined conversation ${messageData.conversationId}`,
          );
          return;
        }

        // Only process messages for the current conversation
        if (messageData.conversationId == currentConversationIdRef.current) {
          // Skip typing notifications for display in the messages list
          if (
            messageData.content === "TYPING" &&
            messageData.messageType === "SYSTEM"
          ) {
            // Handle typing notification separately if needed
            console.log(`User ${messageData.senderUsername} is typing...`);
            return;
          }

          // Convert to expected format
          const formattedMessage: ChatMessage = {
            id: messageData.id || `server-${Date.now()}`,
            senderId: messageData.senderId,
            conversationId: messageData.conversationId,
            messageType: messageData.messageType,
            status: messageData.status || "SENT",
            content: messageData.content,
            timestamp: messageData.timestamp || new Date().toISOString(),
          };

          if (formattedMessage.senderId != userId)
            setMessages(() => [formattedMessage]);
        }
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
      // If we're in a conversation, leave it before closing
      if (
        currentConversationIdRef.current &&
        socketRef.current?.readyState === WebSocket.OPEN
      ) {
        leaveCurrentConversation();
      }

      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING)
      ) {
        socketRef.current.close();
      }
    };
  }, [url, userId]); // Only depend on URL and username, not conversationId

  // Function to join a conversation
  const joinConversation = useCallback(
    (conversationId: string | number) => {
      if (!conversationId) return;

      // If we're already in a conversation, leave it first
      if (
        currentConversationIdRef.current &&
        currentConversationIdRef.current !== conversationId &&
        isConnected
      ) {
        leaveCurrentConversation();
      }

      currentConversationIdRef.current = conversationId;

      // Clear previous messages when joining a new conversation
      setMessages([]);

      // If connected, send join message to server
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            action: "JOIN_CONVERSATION",
            conversationId: Number(conversationId),
            data: {},
          }),
        );
      }
    },
    [isConnected],
  );

  // Function to leave the current conversation
  const leaveCurrentConversation = useCallback(() => {
    if (!currentConversationIdRef.current) return;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          action: "LEAVE_CONVERSATION",
          conversationId: Number(currentConversationIdRef.current),
          data: {},
        }),
      );
    }

    currentConversationIdRef.current = null;
  }, []);

  // Function to send message
  const sendMessage = useCallback((content: string) => {
    if (!currentConversationIdRef.current) {
      console.error("No active conversation");
      return;
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          action: "SEND_MESSAGE",
          conversationId: Number(currentConversationIdRef.current),
          data: {
            content: content,
            messageType: "TEXT", // Default to TEXT message type
          },
        }),
      );
    } else {
      console.error("WebSocket is not connected");
    }
  }, []);

  // Function to send typing notification
  const sendTypingNotification = useCallback(() => {
    if (!currentConversationIdRef.current) return;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          action: "TYPING",
          conversationId: Number(currentConversationIdRef.current),
          data: {},
        }),
      );
    }
  }, []);

  return {
    messages,
    isConnected,
    sendMessage,
    joinConversation,
    leaveConversation: leaveCurrentConversation,
    sendTypingNotification,
    currentConversationId: currentConversationIdRef.current,
  };
}
