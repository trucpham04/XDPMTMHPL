package com.xdpmtmhpl.message_service.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xdpmtmhpl.message_service.Enum.MessageType;
import com.xdpmtmhpl.message_service.dto.ChatMessageDTO;
import com.xdpmtmhpl.message_service.dto.WebSocketRequest;
import com.xdpmtmhpl.message_service.service.ChatService;
import com.xdpmtmhpl.message_service.dto.UserDTO;
import com.xdpmtmhpl.message_service.client.UserClient;

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

    @Autowired
    private UserClient userClient;

    @Autowired
    private ObjectMapper objectMapper;

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, Long> sessionUserIds = new ConcurrentHashMap<>();
    private final Map<Long, Map<String, WebSocketSession>> conversationSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.put(session.getId(), session);

        Map<String, String> params = chatService.extractQueryParameters(session);

        String userIdStr = params.getOrDefault("user_id", "0");
        Long userId = Long.parseLong(userIdStr);

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
            default:
                chatService.sendError(session, "Unknown action: " + request.getAction());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session.getId());

        Long userId = sessionUserIds.get(session.getId());
        if (userId != null) {
            sessionUserIds.remove(session.getId());

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
                    messageType = MessageType.TEXT;
                }
            }

            ChatMessageDTO sentMessage = chatService.sendMessage(
                    conversationId,
                    userId,
                    content,
                    messageType,
                    mediaUrl);

            UserDTO sender = userClient.getUserById(userId);
            if (sender != null) {
                sentMessage.setSenderFullName(sender.getFirstName() + " " + sender.getLastName());
            }

            chatService.broadcastToConversation(conversationId, sentMessage);

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

            if (!chatService.isUserInConversation(userId, conversationId)) {
                chatService.sendError(session, "Not authorized to join this conversation");
                return;
            }

            chatService.addSessionToConversation(conversationId, session.getId(), session);

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

            if (conversationSessions.containsKey(conversationId)) {
                Map<String, WebSocketSession> convSessions = conversationSessions.get(conversationId);

                for (String sessionId : sessionUserIds.keySet()) {
                    if (sessionUserIds.get(sessionId).equals(userId)) {
                        convSessions.remove(sessionId);
                    }
                }

                if (convSessions.isEmpty()) {
                    chatService.removeSessionFromConversation(conversationId, session.getId(), session);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}