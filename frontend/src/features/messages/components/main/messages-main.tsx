import { useState, useEffect } from "react";
import MessagesSection from "./message-section";
import MessagesMainHeader from "./messages-main-header";
import MessagesMainInput from "./messages-main-input";
import { cn } from "@/lib/utils";
import { MessagesMainItemType } from "../../types/messages-sidebar-item-type";
import { useWebSocket } from "../../hooks/useWebSocket";

interface MessagesMainProps extends React.ComponentProps<"div"> {
  conversationId?: string | number;
  currentUserId?: number;
  websocketUrl?: string;
  initialMessages?: MessagesMainItemType[];
}

function MessagesMain({
  className,
  conversationId,
  currentUserId = 1,
  websocketUrl = "wss://api.example.com/ws",
  initialMessages = [],
  ...props
}: MessagesMainProps) {
  // State to hold all messages (initial + from WebSocket)
  const [messages, setMessages] =
    useState<MessagesMainItemType[]>(initialMessages);

  // Connect to WebSocket - ONLY HERE, not in MessagesSection
  const {
    messages: newMessages,
    isConnected,
    sendMessage,
  } = useWebSocket({
    url: websocketUrl,
    conversationId,
  });

  // Update messages when new ones arrive from WebSocket
  useEffect(() => {
    if (newMessages.length > 0) {
      setMessages((prev) => [...prev, ...newMessages]);
    }
  }, [newMessages]);

  // Handler for sending new messages
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Optimistically add message to UI
    const newMessage: MessagesMainItemType = {
      id: `local-${Date.now()}`,
      sender_id: currentUserId,
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Send via WebSocket
    if (conversationId) {
      sendMessage(content);
    }
  };

  return (
    <>
      <div className={cn("flex w-full flex-col", className)} {...props}>
        <MessagesMainHeader
          isConnected={isConnected}
          conversationId={conversationId}
        />
        <div className="max-h-full flex-1 overflow-auto">
          {/* Pass messages down as props, no WebSocket handling here */}
          <MessagesSection messages={messages} currentUserId={currentUserId} />
        </div>
        <MessagesMainInput
          onSendMessage={handleSendMessage}
          disabled={!isConnected && !!conversationId}
        />
      </div>
    </>
  );
}

export default MessagesMain;
