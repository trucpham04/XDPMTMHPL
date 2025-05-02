import { useState, useEffect } from "react";
import MessagesSection from "./message-section";
import MessagesMainHeader from "./messages-main-header";
import { cn } from "@/lib/utils";
import MessageInput from "./messages-main-input";
import { ChatMessage } from "@/types/Message";
import { useChatWebSocket } from "@/hooks";
import useMessage from "@/hooks/useMessage";

interface MessagesMainProps extends React.ComponentProps<"div"> {
  conversationId?: string | number;
  currentUserId: number;
  websocketUrl?: string;
  initialMessages?: ChatMessage[];
}

function MessagesMain({
  className,
  conversationId,
  currentUserId,
  initialMessages = [],
  ...props
}: MessagesMainProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const {
    messages: newMessages,
    isConnected,
    sendMessage,
    joinConversation,
    leaveConversation,
    sendTypingNotification,
  } = useChatWebSocket();

  const { getMessages } = useMessage();

  useEffect(() => {
    if (isConnected && conversationId) {
      joinConversation(conversationId);
    }

    return () => {
      if (conversationId && isConnected) {
        leaveConversation();
      }
    };
  }, [conversationId, isConnected, joinConversation, leaveConversation]);

  // Load initial messages from server
  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) return;
      const serverMessages = await getMessages(Number(conversationId));
      setMessages(serverMessages);
    };

    loadMessages();
  }, [conversationId, getMessages]);

  // Append new websocket messages
  useEffect(() => {
    if (newMessages.length > 0) {
      setMessages((prev) => [...prev, ...newMessages]);
    }
  }, [newMessages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMessage: ChatMessage = {
      senderId: currentUserId,
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    sendMessage(content);
  };

  return (
    <div className={cn("flex h-full w-full flex-col", className)} {...props}>
      {/* <MessagesMainHeader
        isConnected={isConnected}
        conversationId={conversationId}
      /> */}
      <div className="flex-1 overflow-auto">
        <MessagesSection messages={messages} currentUserId={currentUserId} />
      </div>
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={sendTypingNotification}
        disabled={!isConnected || !conversationId}
      />
    </div>
  );
}

export default MessagesMain;
