package com.xdpmtmhpl.notification_service.dto;

import com.xdpmtmhpl.notification_service.enums.NotificationType;
import com.xdpmtmhpl.notification_service.models.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private Long userId;
    private NotificationType type;
    private Long referenceId;
    private boolean isRead;
    private LocalDateTime createdAt;
    private String message; // Tin nhắn hiển thị cho người dùng
    private UserDTO sender;

    public static NotificationDTO fromEntity(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .userId(Long.parseLong(notification.getUserId()))
                .type(NotificationType.valueOf(notification.getType()))
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .message(notification.getMessage())
                .build();
    }
}
