package com.xdpmtmhpl.message_service.client;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xdpmtmhpl.message_service.dto.notification.NotificationRequest;
import com.xdpmtmhpl.message_service.dto.notification.NotificationType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationClient {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    private static final String QUEUE_NAME = "notification_service.queue";

    public void sendNotification(Long userId, NotificationType type, Long senderId) {
        try {
            NotificationRequest notification = new NotificationRequest();
            notification.setUserId(userId);
            notification.setType(type);
            notification.setSenderId(senderId);

            String notificationJson = objectMapper.writeValueAsString(notification);

            rabbitTemplate.convertAndSend(QUEUE_NAME, notificationJson);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send notification message", e);
        }
    }
}