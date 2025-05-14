package com.example.friend_service.service;

import com.example.friend_service.Config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final RabbitTemplate rabbitTemplate;

    public void sendFriendRequestNotification(String senderId, String senderName, String receiverId) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("userId", receiverId);
        notification.put("title", "New Friend Request");
        notification.put("message", senderName + " sent you a friend request");
        notification.put("type", "FRIEND_REQUEST");
        notification.put("senderId", senderId);
        notification.put("senderName", senderName);
        notification.put("createdAt", LocalDateTime.now().toString());
        notification.put("read", false);

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.NOTIFICATION_EXCHANGE,
                RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
                notification);
        log.info("Sent friend request notification to user: {}", receiverId);
        log.info("Notification: {}", notification);
    }

    public void sendFriendRequestAcceptedNotification(String accepterId, String accepterName, String senderId) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("userId", senderId);
        notification.put("title", "Friend Request Accepted");
        notification.put("message", accepterName + " accepted your friend request");
        notification.put("type", "FRIEND_REQUEST_ACCEPTED");
        notification.put("senderId", accepterId);
        notification.put("senderName", accepterName);
        notification.put("createdAt", LocalDateTime.now().toString());
        notification.put("read", false);

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.NOTIFICATION_EXCHANGE,
                RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
                notification);
        log.info("Sent friend request accepted notification to user: {}", senderId);
        log.info("Notification: {}", notification);
    }
}