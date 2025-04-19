import { useState, useCallback } from "react";
import chatService from "../services/chatService";
import { ChatMessage, Conversation, ConversationCreateRequest } from "../types";

export const useMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Get conversations by user
  const getUserConversations = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await chatService.getUserConversations(userId);
      setConversations(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to get conversations");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new conversation
  const createConversation = useCallback(
    async (data: ConversationCreateRequest) => {
      setLoading(true);
      setError(null);
      try {
        const res = await chatService.createConversation(data);
        setConversations((prev) => [...prev, res]);
        return res;
      } catch (err: any) {
        setError(err.message || "Failed to create conversation");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Get messages for a conversation
  const getMessages = useCallback(async (conversationId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await chatService.getConversationMessages(conversationId);
      setMessages(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to get messages");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Update message status
  const updateMessageStatus = useCallback(
    async (messageId: number, status: string) => {
      setLoading(true);
      setError(null);
      try {
        await chatService.updateMessageStatus(messageId, status);
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to update message status");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Check if user is in conversation
  const isUserInConversation = useCallback(
    async (conversationId: number, userId: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await chatService.isUserInConversation(
          conversationId,
          userId,
        );
        return res === true;
      } catch (err: any) {
        setError(err.message || "Failed to check user in conversation");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    conversations,
    messages,
    getUserConversations,
    createConversation,
    getMessages,
    updateMessageStatus,
    isUserInConversation,
  };
};

export default useMessage;
