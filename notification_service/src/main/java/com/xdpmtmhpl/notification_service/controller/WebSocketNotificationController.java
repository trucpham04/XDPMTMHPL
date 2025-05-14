package com.xdpmtmhpl.notification_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.xdpmtmhpl.notification_service.models.Notification;
import com.xdpmtmhpl.notification_service.Client.UserClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class WebSocketNotificationController extends TextWebSocketHandler {
    private final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;
    private final UserClient userClient;

    public WebSocketNotificationController(UserClient userClient) {
        this.userClient = userClient;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = getUserIdFromSession(session);
        if (userId != null) {
            userSessions.put(userId, session);
            log.info("User {} connected to WebSocket", userId);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String userId = getUserIdFromSession(session);
        if (userId != null) {
            userSessions.remove(userId);
            log.info("User {} disconnected from WebSocket", userId);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        // Handle any incoming messages if needed
        log.info("Received message: {}", message.getPayload());
    }

    public void sendNotification(Notification notification) {
        WebSocketSession session = userSessions.get(notification.getUserId());
        log.info("Current active sessions: {}", userSessions.keySet());
        if (session != null && session.isOpen()) {
            try {
                // Fetch sender information
                if (notification.getSenderId() != null) {
                    var sender = userClient.getUserById(Integer.parseInt(notification.getSenderId()));
                    notification.setSender(sender);
                    log.info("Fetched sender information: {}", sender);
                }

                String notificationJson = objectMapper.writeValueAsString(notification);
                log.info("Sending WebSocket message - Session ID: {}, User ID: {}, Message: {}",
                        session.getId(), notification.getUserId(), notificationJson);
                session.sendMessage(new TextMessage(notificationJson));
                log.info("Successfully sent notification to user {}: {}", notification.getUserId(), notificationJson);
            } catch (IOException e) {
                log.error("Error sending notification to user {}: {}", notification.getUserId(), e.getMessage(), e);
            }
        } else {
            log.warn("User {} is not connected to WebSocket. Session exists: {}, Session open: {}",
                    notification.getUserId(),
                    session != null,
                    session != null && session.isOpen());
        }
    }

    private String getUserIdFromSession(WebSocketSession session) {
        String query = session.getUri().getQuery();
        if (query != null && query.contains("userId=")) {
            return query.split("userId=")[1];
        }
        return null;
    }
}
