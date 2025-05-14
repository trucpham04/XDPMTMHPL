import { useState, useEffect } from "react";
import MessagesSection from "./message-section";
import MessagesMainHeader from "./messages-main-header";
import { cn } from "@/lib/utils";
import MessageInput from "./messages-main-input";
import { ChatMessage, Conversation } from "@/types/Message";
import { useChatWebSocket } from "@/hooks";
import useMessage from "@/hooks/useMessage";
import { useAuthContext } from "@/contexts/AuthContext";

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
  const [conversation, setConversation] = useState<Conversation>();
  const { user } = useAuthContext();

  const {
    messages: newMessages,
    isConnected,
    sendMessage,
    joinConversation,
    leaveConversation,
  } = useChatWebSocket();

  const { getMessages, getConversation } = useMessage();

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

  useEffect(() => {
    const loadData = async () => {
      if (!conversationId) return;
      const [serverMessages, conv] = await Promise.all([
        getMessages(Number(conversationId)),
        getConversation(Number(conversationId)),
      ]);
      setMessages(serverMessages);
      if (conv) {
        setConversation(conv);
      }
    };

    loadData();
  }, [conversationId, getMessages, getConversation]);

  useEffect(() => {
    if (newMessages.length > 0) {
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const uniqueNewMessages = newMessages.filter(
          (m) => !existingIds.has(m.id),
        );
        return [...prev, ...uniqueNewMessages];
      });
    }
  }, [newMessages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      conversationId: Number(conversationId),
      senderId: currentUserId,
      content,
      messageType: "TEXT",
      status: "SENT",
      timestamp: new Date().toISOString(),
      senderFullName: user?.firstName + " " + user?.lastName,
    };

    setMessages((prev) => [...prev, newMessage]);

    sendMessage(content);
  };

  return (
    <div className={cn("flex h-full w-full flex-col", className)} {...props}>
      <MessagesMainHeader
        isConnected={isConnected}
        conversation={conversation}
      />
      <div className="flex-1 overflow-auto">
        <MessagesSection messages={messages} currentUserId={currentUserId} />
      </div>
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={!isConnected || !conversationId}
      />
    </div>
  );
}

export default MessagesMain;
