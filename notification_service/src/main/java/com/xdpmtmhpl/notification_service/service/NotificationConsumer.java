package com.xdpmtmhpl.notification_service.service;

import com.xdpmtmhpl.notification_service.config.RabbitMQConfig;
import com.xdpmtmhpl.notification_service.controller.WebSocketNotificationController;
import com.xdpmtmhpl.notification_service.models.Notification;
import com.xdpmtmhpl.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationConsumer {
    private final NotificationRepository notificationRepository;
    private final WebSocketNotificationController webSocketNotificationController;

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_QUEUE)
    public void consumeNotification(Notification notification) {
        try {
            // Save notification to database
            log.info("Received notification: {}", notification);
            Notification savedNotification = notificationRepository.save(notification);
            log.info("Saved notification: {}", savedNotification);

            // Send notification to user via WebSocket
            webSocketNotificationController.sendNotification(savedNotification);
            log.info("Sent notification to user {} via WebSocket", notification.getUserId());
        } catch (Exception e) {
            log.error("Error processing notification: {}", e.getMessage(), e);
        }
    }
}