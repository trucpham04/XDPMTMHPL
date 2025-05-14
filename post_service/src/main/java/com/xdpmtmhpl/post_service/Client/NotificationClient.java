package com.xdpmtmhpl.post_service.Client;

import com.xdpmtmhpl.post_service.config.RabbitMQConfig;
import com.xdpmtmhpl.post_service.dto.NotificationRequest;
import com.xdpmtmhpl.post_service.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationClient {
    private final RabbitTemplate rabbitTemplate;

    public void sendNotification(Integer userId, NotificationType type, Integer referenceId, String title,
            String message, String senderId) {
        sendNotification(userId.longValue(), type, referenceId.longValue(), title, message, senderId);
    }

    public void sendNotification(Long userId, NotificationType type, Long referenceId, String title, String message,
            String senderId) {
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .userId(userId)
                .type(type)
                .referenceId(referenceId)
                .title(title)
                .message(message)
                .senderId(senderId)
                .read(false)
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.NOTIFICATION_EXCHANGE,
                RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
                notificationRequest);
    }
}