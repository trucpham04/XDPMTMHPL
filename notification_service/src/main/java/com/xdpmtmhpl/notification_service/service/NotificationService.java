package com.xdpmtmhpl.notification_service.service;

import org.springframework.stereotype.Service;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.PageRequest;
import com.xdpmtmhpl.notification_service.models.Notification;
import com.xdpmtmhpl.notification_service.repository.NotificationRepository;
import com.xdpmtmhpl.notification_service.dto.NotificationRequest;
import com.xdpmtmhpl.notification_service.dto.NotificationResponse;
import com.xdpmtmhpl.notification_service.Client.UserClient;
import com.xdpmtmhpl.notification_service.dto.NotificationDTO;
import com.xdpmtmhpl.notification_service.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final RabbitTemplate rabbitTemplate;
    private final NotificationRepository notificationRepository;
    private final UserClient userClient;

    public Notification createNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId().toString())
                .type(request.getType().toString())
                .title(request.getTitle())
                .message(request.getMessage())
                .senderId(request.getSenderId())
                .read(request.isRead())
                .build();
        log.info("Created notification: {}", notification);
        return notificationRepository.save(notification);
    }

    public NotificationResponse getUserNotifications(Long userId, int page, int size) {
        var notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId.toString(),
                PageRequest.of(page, size));

        var notificationDTOs = notifications.getContent().stream()
                .map(notification -> {
                    NotificationDTO dto = NotificationDTO.fromEntity(notification);
                    // Add sender information if available
                    if (notification.getSenderId() != null) {
                        try {
                            dto.setSender(userClient.getUserById(Integer.parseInt(notification.getSenderId())));
                        } catch (Exception e) {
                            log.error("Error fetching sender information for notification {}: {}",
                                    notification.getId(), e.getMessage());
                        }
                    }
                    return dto;
                })
                .toList();

        return NotificationResponse.builder()
                .notifications(notificationDTOs)
                .totalElements(notifications.getTotalElements())
                .totalPages(notifications.getTotalPages())
                .currentPage(page)
                .hasNext(notifications.hasNext())
                .build();
    }

    public NotificationDTO getNotification(Long id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    NotificationDTO dto = NotificationDTO.fromEntity(notification);
                    // Add sender information if available
                    if (notification.getSenderId() != null) {
                        try {
                            dto.setSender(userClient.getUserById(Integer.parseInt(notification.getSenderId())));
                        } catch (Exception e) {
                            log.error("Error fetching sender information for notification {}: {}",
                                    notification.getId(), e.getMessage());
                        }
                    }
                    return dto;
                })
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId.toString());
    }

    public NotificationResponse getNotificationsByType(Long userId, NotificationType type, int page, int size) {
        var notifications = notificationRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId.toString(),
                type.toString(), PageRequest.of(page, size));

        var notificationDTOs = notifications.getContent().stream()
                .map(notification -> {
                    NotificationDTO dto = NotificationDTO.fromEntity(notification);
                    // Add sender information if available
                    if (notification.getSenderId() != null) {
                        try {
                            dto.setSender(userClient.getUserById(Integer.parseInt(notification.getSenderId())));
                        } catch (Exception e) {
                            log.error("Error fetching sender information for notification {}: {}",
                                    notification.getId(), e.getMessage());
                        }
                    }
                    return dto;
                })
                .toList();

        return NotificationResponse.builder()
                .notifications(notificationDTOs)
                .totalElements(notifications.getTotalElements())
                .totalPages(notifications.getTotalPages())
                .currentPage(page)
                .hasNext(notifications.hasNext())
                .build();
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId.toString());
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public void sendNotification(Notification notification) {
        try {
            // Save notification to database
            notificationRepository.save(notification);

            // Send to RabbitMQ
            rabbitTemplate.convertAndSend("notification.exchange", "notification.routing.key", notification);

            log.info("Notification sent successfully: {}", notification);
        } catch (Exception e) {
            log.error("Error sending notification: {}", e.getMessage());
            throw new RuntimeException("Failed to send notification", e);
        }
    }

    public void sendFriendRequestNotification(String senderId, String receiverId, String senderName) {
        Notification notification = Notification.builder()
                .userId(receiverId)
                .senderId(senderId)
                .title("New Friend Request")
                .message(senderName + " sent you a friend request")
                .type("FRIEND_REQUEST")
                .build();
        sendNotification(notification);
    }

    public void sendFriendRequestAcceptedNotification(String senderId, String receiverId, String receiverName) {
        Notification notification = Notification.builder()
                .userId(senderId)
                .senderId(receiverId)
                .title("Friend Request Accepted")
                .message(receiverName + " accepted your friend request")
                .type("FRIEND_REQUEST_ACCEPTED")
                .build();
        sendNotification(notification);
    }
}