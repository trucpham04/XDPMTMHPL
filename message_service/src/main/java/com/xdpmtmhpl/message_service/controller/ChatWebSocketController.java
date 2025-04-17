package com.xdpmtmhpl.message_service.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xdpmtmhpl.message_service.Enum.MessageType;
import com.xdpmtmhpl.message_service.dto.ChatMessageDTO;
import com.xdpmtmhpl.message_service.dto.UserDTO;
import com.xdpmtmhpl.message_service.dto.WebSocketRequest;
import com.xdpmtmhpl.message_service.service.ChatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketController extends TextWebSocketHandler {

    // Use @Lazy to break the circular dependency
    @Autowired
    private ChatService chatService;

    @Autowired
    private ObjectMapper objectMapper;

    public ChatWebSocketController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper; // This will use the configured ObjectMapper bean with JavaTimeModule
    }

    // Session tracking
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, Long> sessionUserIds = new ConcurrentHashMap<>();
    private final Map<Long, Map<String, WebSocketSession>> conversationSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // Store the session
        sessions.put(session.getId(), session);

        // User information will be extracted from authentication or query parameters
        Map<String, String> params = chatService.extractQueryParameters(session);

        // Get username from query parameter or use default
        String userIdStr = params.getOrDefault("user_id", "0"); // Provide a default value
        Long userId = Long.parseLong(userIdStr);

        // Store the user ID associated with this session
        sessionUserIds.put(session.getId(), userId);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        WebSocketRequest request = chatService.parseRequest(payload);

        if (request == null) {
            chatService.sendError(session, "Invalid request format");
            return;
        }

        Long userId = sessionUserIds.get(session.getId());

        // Process the request based on the action
        switch (request.getAction()) {
            case "SEND_MESSAGE":
                handleSendMessage(session, userId, request);
                break;
            case "JOIN_CONVERSATION":
                handleJoinConversation(session, userId, request);
                break;
            case "LEAVE_CONVERSATION":
                handleLeaveConversation(session, userId, request);
                break;
            case "TYPING":
                handleTypingNotification(userId, request);
                break;
            default:
                chatService.sendError(session, "Unknown action: " + request.getAction());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // Remove the session from tracking
        sessions.remove(session.getId());

        // Get the user ID associated with this session
        Long userId = sessionUserIds.get(session.getId());
        if (userId != null) {
            sessionUserIds.remove(session.getId());

            // Remove user from all conversation sessions
            for (Map<String, WebSocketSession> conversationMap : conversationSessions.values()) {
                conversationMap.remove(session.getId());
            }
        }
    }

    private void handleSendMessage(WebSocketSession session, Long userId, WebSocketRequest request) {
        try {
            Long conversationId = request.getConversationId();
            JsonNode data = request.getData();

            if (conversationId == null || data == null) {
                chatService.sendError(session, "Missing conversation ID or message data");
                return;
            }

            String content = data.has("content") ? data.get("content").asText() : "";
            String mediaUrl = data.has("mediaUrl") ? data.get("mediaUrl").asText() : null;

            MessageType messageType = MessageType.TEXT;
            if (data.has("messageType")) {
                try {
                    messageType = MessageType.valueOf(data.get("messageType").asText());
                } catch (IllegalArgumentException e) {
                    // Default to TEXT if invalid
                }
            }

            // Save and broadcast the message
            ChatMessageDTO sentMessage = chatService.sendMessage(
                    conversationId,
                    userId,
                    content,
                    messageType,
                    mediaUrl);

            // Since we're not using STOMP anymore, manually broadcast to conversation
            // participants
            // chatService.broadcastToConversation(conversationId, sentMessage);

        } catch (Exception e) {
            try {
                chatService.sendError(session, "Error processing message: " + e.getMessage());
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    private void handleJoinConversation(WebSocketSession session, Long userId, WebSocketRequest request) {
        try {
            Long conversationId = request.getConversationId();

            if (conversationId == null) {
                chatService.sendError(session, "Missing conversation ID");
                return;
            }

            // Check if user can access this conversation
            if (!chatService.isUserInConversation(userId, conversationId)) {
                chatService.sendError(session, "Not authorized to join this conversation");
                return;
            }

            // Add the session to the conversation sessions map
            chatService.addSessionToConversation(conversationId, session.getId(), session);

            // Get user info to include in the join notification
            UserDTO user = chatService.getUserById(userId);

            // Send confirmation to the client
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(
                    Map.of("type", "JOIN_CONFIRMATION", "conversationId", conversationId))));

        } catch (Exception e) {
            try {
                chatService.sendError(session, "Error joining conversation: " + e.getMessage());
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    private void handleLeaveConversation(WebSocketSession session, Long userId, WebSocketRequest request) {
        try {
            Long conversationId = request.getConversationId();

            if (conversationId == null) {
                return;
            }

            // Remove all user's sessions from the conversation
            if (conversationSessions.containsKey(conversationId)) {
                Map<String, WebSocketSession> convSessions = conversationSessions.get(conversationId);

                // Find all sessions for this user in this conversation
                for (String sessionId : sessionUserIds.keySet()) {
                    if (sessionUserIds.get(sessionId).equals(userId)) {
                        convSessions.remove(sessionId);
                    }
                }

                // If no sessions left, remove the conversation entry
                if (convSessions.isEmpty()) {
                    chatService.removeSessionFromConversation(conversationId, session.getId(), session);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleTypingNotification(Long userId, WebSocketRequest request) {
        try {
            Long conversationId = request.getConversationId();

            if (conversationId == null) {
                return;
            }

            // Get user info
            UserDTO user = chatService.getUserById(userId);

            // Create typing notification (not saved to database)
            ChatMessageDTO typingNotification = new ChatMessageDTO();
            typingNotification.setConversationId(conversationId);
            typingNotification.setSenderId(userId);
            typingNotification.setSenderUsername(user.getUsername());
            typingNotification.setMessageType(MessageType.SYSTEM);
            typingNotification.setContent("TYPING");

            // Broadcast typing notification
            chatService.broadcastToConversation(conversationId, typingNotification);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}