package com.xdpmtmhpl.message_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.xdpmtmhpl.message_service.Enum.MessageType;
import com.xdpmtmhpl.message_service.client.UserServiceClient;
import com.xdpmtmhpl.message_service.dto.ChatMessageDTO;
import com.xdpmtmhpl.message_service.dto.UserDTO;
import com.xdpmtmhpl.message_service.service.ChatService;

import java.security.Principal;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserServiceClient userServiceClient;

    @MessageMapping("/chat.sendMessage/{conversationId}")
    public void sendMessage(@DestinationVariable Long conversationId,
            @Payload ChatMessageDTO chatMessageDto,
            Principal principal) {

        // Get current user ID from the principal or from the authenticated user
        Long currentUserId = getUserIdFromPrincipal(principal);

        // Send the message using the service
        chatService.sendMessage(
                conversationId,
                currentUserId,
                chatMessageDto.getContent(),
                chatMessageDto.getMessageType(),
                chatMessageDto.getMediaUrl());
    }

    @MessageMapping("/chat.joinConversation/{conversationId}")
    public void joinConversation(@DestinationVariable Long conversationId,
            SimpMessageHeaderAccessor headerAccessor,
            Principal principal) {

        Long currentUserId = getUserIdFromPrincipal(principal);

        // Store information in WebSocket session
        headerAccessor.getSessionAttributes().put("userId", currentUserId);
        headerAccessor.getSessionAttributes().put("conversationId", conversationId);

        // Using system message to notify others
        chatService.sendMessage(
                conversationId,
                currentUserId,
                "joined the conversation", // This could be handled specially by the frontend
                MessageType.SYSTEM,
                null);
    }

    @MessageMapping("/chat.leaveConversation/{conversationId}")
    public void leaveConversation(@DestinationVariable Long conversationId,
            Principal principal) {

        Long currentUserId = getUserIdFromPrincipal(principal);

        // Using system message to notify others
        chatService.sendMessage(
                conversationId,
                currentUserId,
                "left the conversation",
                MessageType.SYSTEM,
                null);
    }

    @MessageMapping("/chat.typing/{conversationId}")
    public void notifyTyping(@DestinationVariable Long conversationId,
            Principal principal) {

        Long currentUserId = getUserIdFromPrincipal(principal);
        UserDTO user = userServiceClient.getUserById(currentUserId);

        // Create a special DTO for typing notifications
        ChatMessageDTO typingNotification = new ChatMessageDTO();
        typingNotification.setConversationId(conversationId);
        typingNotification.setSenderId(currentUserId);
        typingNotification.setSenderUsername(user.getUsername());
        typingNotification.setMessageType(MessageType.SYSTEM);
        typingNotification.setContent("TYPING"); // Special content that frontend will recognize

        // Use the messaging template directly for this lightweight notification
        chatService.getMessagingTemplate().convertAndSend(
                "/topic/conversation." + conversationId + ".typing",
                typingNotification);
    }

    private Long getUserIdFromPrincipal(Principal principal) {
        // This will depend on your authentication mechanism
        // For example, with JWT, you might extract the user ID from the token

        // For simplicity, let's assume we can call the user service with the username
        UserDTO currentUser = userServiceClient.getCurrentUser();
        return currentUser.getId();
    }
}