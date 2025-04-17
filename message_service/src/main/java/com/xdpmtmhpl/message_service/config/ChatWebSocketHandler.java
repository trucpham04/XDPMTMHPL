package com.xdpmtmhpl.message_service.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xdpmtmhpl.message_service.dto.ChatMessageDTO;
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
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Store sessions by user ID
    private final Map<Long, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    // Store sessions by conversation ID
    private final Map<Long, Map<String, WebSocketSession>> conversationSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // User ID will be supplied as a query parameter or header
        Map<String, String> attributes = extractAttributes(session);
        Long userId = Long.parseLong(attributes.getOrDefault("userId", "0"));
        Long conversationId = Long.parseLong(attributes.getOrDefault("conversationId", "0"));

        if (userId > 0) {
            userSessions.put(userId, session);
        }

        if (conversationId > 0) {
            conversationSessions
                    .computeIfAbsent(conversationId, k -> new ConcurrentHashMap<>())
                    .put(session.getId(), session);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        ChatMessageDTO chatMessage = objectMapper.readValue(payload, ChatMessageDTO.class);

        // Store message in database through service (this would be handled elsewhere)

        // Forward message to all clients in the conversation
        sendMessageToConversation(chatMessage);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // Clean up sessions when client disconnects
        Map<String, String> attributes = extractAttributes(session);
        Long userId = Long.parseLong(attributes.getOrDefault("userId", "0"));
        Long conversationId = Long.parseLong(attributes.getOrDefault("conversationId", "0"));

        if (userId > 0) {
            userSessions.remove(userId);
        }

        if (conversationId > 0 && conversationSessions.containsKey(conversationId)) {
            conversationSessions.get(conversationId).remove(session.getId());
            if (conversationSessions.get(conversationId).isEmpty()) {
                conversationSessions.remove(conversationId);
            }
        }
    }

    public void sendMessageToUser(Long userId, ChatMessageDTO message) throws IOException {
        WebSocketSession session = userSessions.get(userId);
        if (session != null && session.isOpen()) {
            String json = objectMapper.writeValueAsString(message);
            session.sendMessage(new TextMessage(json));
        }
    }

    public void sendMessageToConversation(ChatMessageDTO message) throws IOException {
        Long conversationId = message.getConversationId();
        String json = objectMapper.writeValueAsString(message);

        if (conversationSessions.containsKey(conversationId)) {
            for (WebSocketSession session : conversationSessions.get(conversationId).values()) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(json));
                }
            }
        }
    }

    private Map<String, String> extractAttributes(WebSocketSession session) {
        // Extract attributes from session, implementation depends on how you pass user
        // ID
        // This is just a placeholder - you'd need to implement based on your
        // authentication approach
        return new ConcurrentHashMap<>();
    }
}