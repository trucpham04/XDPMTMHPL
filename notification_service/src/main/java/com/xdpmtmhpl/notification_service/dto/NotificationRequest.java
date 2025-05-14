package com.xdpmtmhpl.notification_service.dto;

import com.xdpmtmhpl.notification_service.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private Long userId;
    private NotificationType type;
    private Long referenceId;
    private String title;
    private String message;
    private String senderId;
    private boolean read;
}
