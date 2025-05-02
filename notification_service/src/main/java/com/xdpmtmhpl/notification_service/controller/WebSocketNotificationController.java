package com.xdpmtmhpl.notification_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.xdpmtmhpl.notification_service.service.NotificationService;

import java.util.Map;

@Component
public class WebSocketNotificationController extends TextWebSocketHandler {

    @Autowired
    private NotificationService notificationService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        Map<String, String> params = notificationService.extractQueryParameters(session);
        Long userId = Long.parseLong(params.getOrDefault("user_id", "0"));
        notificationService.registerSession(session.getId(), userId, session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        notificationService.unregisterSession(session.getId());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        System.out.println("Error: " + exception.getMessage());
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}
