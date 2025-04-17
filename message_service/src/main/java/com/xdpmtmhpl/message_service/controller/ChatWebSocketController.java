package com.xdpmtmhpl.message_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
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

    @Autowired
    private ChatService chatService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Session tracking
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, Long> sessionUserIds = new ConcurrentHashMap<>();
    private final Map<Long, Map<String, WebSocketSession>> conversationSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // Store the session
        sessions.put(session.getId(), session);

        // User information will be extracted from authentication or query parameters
        Map<String, String> params = extractQueryParameters(session);

        // Get username from query parameter or use default
        String username = params.getOrDefault("username", "trucpham04");

        // Get user info
        UserDTO user = chatService.getUserByUsername(username);
        Long userId = user.getId();

        // Store the user ID associated with this session
        sessionUserIds.put(session.getId(), userId);

        // Send confirmation of connection
        try {
            ChatMessageDTO connectionMessage = new ChatMessageDTO();
            connectionMessage.setMessageType(MessageType.SYSTEM);
            // connectionMessage.setContent("Connected to WebSocket");
            connectionMessage.setSenderId(userId);
            connectionMessage.setSenderUsername(username);

            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(connectionMessage)));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        WebSocketRequest request = parseRequest(payload);

        if (request == null) {
            sendError(session, "Invalid request format");
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
                handleLeaveConversation(userId, request);
                break;
            case "TYPING":
                handleTypingNotification(userId, request);
                break;
            default:
                sendError(session, "Unknown action: " + request.getAction());
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
                sendError(session, "Missing conversation ID or message data");
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
            broadcastToConversation(conversationId, sentMessage);

        } catch (Exception e) {
            try {
                sendError(session, "Error processing message: " + e.getMessage());
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    private void handleJoinConversation(WebSocketSession session, Long userId, WebSocketRequest request) {
        try {
            Long conversationId = request.getConversationId();

            if (conversationId == null) {
                sendError(session, "Missing conversation ID");
                return;
            }

            // Check if user can access this conversation
            if (!chatService.isUserInConversation(userId, conversationId)) {
                sendError(session, "Not authorized to join this conversation");
                return;
            }

            // Add the session to the conversation sessions map
            conversationSessions
                    .computeIfAbsent(conversationId, k -> new ConcurrentHashMap<>())
                    .put(session.getId(), session);

            // Get user info to include in the join notification
            UserDTO user = chatService.getUserById(userId);

            // Create a join message
            ChatMessageDTO joinMessage = new ChatMessageDTO();
            joinMessage.setConversationId(conversationId);
            joinMessage.setSenderId(userId);
            joinMessage.setSenderUsername(user.getUsername());
            joinMessage.setMessageType(MessageType.SYSTEM);
            joinMessage.setContent("joined the conversation");

            // Save the system message and broadcast
            chatService.saveMessage(joinMessage);
            broadcastToConversation(conversationId, joinMessage);

            // Send confirmation to the client
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(
                    Map.of("type", "JOIN_CONFIRMATION", "conversationId", conversationId))));

        } catch (Exception e) {
            try {
                sendError(session, "Error joining conversation: " + e.getMessage());
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    private void handleLeaveConversation(Long userId, WebSocketRequest request) {
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
                    conversationSessions.remove(conversationId);
                }
            }

            // Get user info
            UserDTO user = chatService.getUserById(userId);

            // Create leave message
            ChatMessageDTO leaveMessage = new ChatMessageDTO();
            leaveMessage.setConversationId(conversationId);
            leaveMessage.setSenderId(userId);
            leaveMessage.setSenderUsername(user.getUsername());
            leaveMessage.setMessageType(MessageType.SYSTEM);
            leaveMessage.setContent("left the conversation");

            // Save the system message and broadcast
            chatService.saveMessage(leaveMessage);
            broadcastToConversation(conversationId, leaveMessage);

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
            broadcastToConversation(conversationId, typingNotification);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void broadcastToConversation(Long conversationId, ChatMessageDTO message) throws IOException {
        String messageJson = objectMapper.writeValueAsString(message);
        TextMessage textMessage = new TextMessage(messageJson);

        if (conversationSessions.containsKey(conversationId)) {
            Map<String, WebSocketSession> sessions = conversationSessions.get(conversationId);

            for (WebSocketSession session : sessions.values()) {
                if (session.isOpen()) {
                    session.sendMessage(textMessage);
                }
            }
        }
    }

    private void sendError(WebSocketSession session, String errorMessage) throws IOException {
        Map<String, Object> errorResponse = Map.of(
                "type", "ERROR",
                "message", errorMessage);

        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(errorResponse)));
    }

    private WebSocketRequest parseRequest(String payload) {
        try {
            return objectMapper.readValue(payload, WebSocketRequest.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    private Map<String, String> extractQueryParameters(WebSocketSession session) {
        // Extract query parameters from the URI
        Map<String, String> params = new ConcurrentHashMap<>();

        String uri = session.getUri().toString();
        int queryStartIndex = uri.indexOf('?');

        if (queryStartIndex > 0) {
            String query = uri.substring(queryStartIndex + 1);
            String[] pairs = query.split("&");

            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    params.put(keyValue[0], keyValue[1]);
                }
            }
        }

        return params;
    }
}