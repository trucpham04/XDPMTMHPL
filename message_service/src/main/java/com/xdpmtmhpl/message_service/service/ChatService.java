package com.xdpmtmhpl.message_service.service;

import com.xdpmtmhpl.message_service.Enum.MessageType;
import com.xdpmtmhpl.message_service.dto.ChatMessageDTO;
import com.xdpmtmhpl.message_service.dto.UserDTO;
import com.xdpmtmhpl.message_service.models.Conversation;

import java.util.List;

public interface ChatService {

    // Replace this method
    // SimpMessagingTemplate getMessagingTemplate();
    WebSocketMessageService getMessagingService();

    List<Conversation> getUserConversations(Long userId);

    Conversation createConversation(String name, boolean isGroupChat, List<Long> participantIds);

    boolean isUserInConversation(Long userId, Long conversationId);

    List<ChatMessageDTO> getConversationMessages(Long conversationId);

    void updateMessageStatus(Long messageId, String status);

    ChatMessageDTO saveMessage(ChatMessageDTO messageDTO);

    ChatMessageDTO sendMessage(Long conversationId, Long senderId, String content,
            MessageType messageType, String mediaUrl);

    UserDTO getUserById(Long userId);

    UserDTO getUserByUsername(String username);
}