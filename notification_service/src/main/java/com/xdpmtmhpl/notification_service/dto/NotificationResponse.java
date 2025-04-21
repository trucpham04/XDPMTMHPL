package com.xdpmtmhpl.notification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private List<NotificationDTO> notifications;
    private int totalPages;
    private long totalElements;
    private int currentPage;
    private boolean hasNext;
}
