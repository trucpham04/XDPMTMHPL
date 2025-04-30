package com.xdpmtmhpl.notification_service.service;

import java.util.Map;

import org.springframework.web.socket.WebSocketSession;

import com.xdpmtmhpl.notification_service.dto.NotificationDTO;
import com.xdpmtmhpl.notification_service.dto.NotificationRequest;
import com.xdpmtmhpl.notification_service.dto.NotificationResponse;
import com.xdpmtmhpl.notification_service.enums.NotificationType;
import com.xdpmtmhpl.notification_service.models.Notification;

public interface NotificationService {
    Notification createNotification(NotificationRequest request);

    NotificationResponse getUserNotifications(Long userId, int page, int size);

    NotificationDTO getNotification(Long id);

    void deleteNotification(Long id);

    Map<String, String> extractQueryParameters(WebSocketSession session);

    NotificationResponse getNotificationsByType(Long userId, NotificationType type, int page, int size);

    void registerSession(String sessionId, Long userId, WebSocketSession session);

    void unregisterSession(String sessionId);

    void sendNotificationToUser(Long userId, Notification notification);

    void sendNotificationToUser(Long userId, String message);

    NotificationDTO convertToDTO(Notification notification);

    Notification createAndSendNotification(NotificationRequest request);
}