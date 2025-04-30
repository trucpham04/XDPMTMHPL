package com.xdpmtmhpl.notification_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.databind.ObjectMapper;
<<<<<<< Updated upstream
import com.xdpmtmhpl.notification_service.client.UserClient;
import com.xdpmtmhpl.notification_service.dto.NotificationDTO;
import com.xdpmtmhpl.notification_service.dto.NotificationRequest;
import com.xdpmtmhpl.notification_service.dto.NotificationResponse;
import com.xdpmtmhpl.notification_service.dto.UserDTO;
=======
import com.xdpmtmhpl.notification_service.dto.NotificationDTO;
import com.xdpmtmhpl.notification_service.dto.NotificationRequest;
import com.xdpmtmhpl.notification_service.dto.NotificationResponse;
>>>>>>> Stashed changes
import com.xdpmtmhpl.notification_service.enums.NotificationType;
import com.xdpmtmhpl.notification_service.exception.ResourceNotFoundException;
import com.xdpmtmhpl.notification_service.models.Notification;
import com.xdpmtmhpl.notification_service.repository.NotificationRepository;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, Long> sessionUserIds = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
<<<<<<< Updated upstream
    private final UserClient userClient;
=======
>>>>>>> Stashed changes

    @Override
    @Transactional
    public Notification createNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .type(request.getType())
<<<<<<< Updated upstream
                .senderId(request.getSenderId())
=======
                .referenceId(request.getReferenceId())
                .isRead(false)
>>>>>>> Stashed changes
                .build();

        return notificationRepository.save(notification);
    }

    @Override
    public NotificationResponse getUserNotifications(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notificationsPage = notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId, pageable);

        List<NotificationDTO> notificationDTOs = notificationsPage.getContent()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return NotificationResponse.builder()
                .notifications(notificationDTOs)
                .totalPages(notificationsPage.getTotalPages())
                .totalElements(notificationsPage.getTotalElements())
                .currentPage(page)
                .hasNext(notificationsPage.hasNext())
                .build();
    }

    @Override
    public NotificationDTO getNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        return convertToDTO(notification);
    }

    @Override
    @Transactional
<<<<<<< Updated upstream
=======
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        unreadNotifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    @Override
    @Transactional
>>>>>>> Stashed changes
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    @Override
<<<<<<< Updated upstream
=======
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
>>>>>>> Stashed changes
    public NotificationResponse getNotificationsByType(Long userId, NotificationType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notificationsPage = notificationRepository
                .findByUserIdAndType(userId, type, pageable);

        List<NotificationDTO> notificationDTOs = notificationsPage.getContent()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return NotificationResponse.builder()
                .notifications(notificationDTOs)
                .totalPages(notificationsPage.getTotalPages())
                .totalElements(notificationsPage.getTotalElements())
                .currentPage(page)
                .hasNext(notificationsPage.hasNext())
                .build();
    }

<<<<<<< Updated upstream
    public NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .type(notification.getType())
                .senderId(notification.getSenderId())
                .createdAt(notification.getCreatedAt())
                .message(generateMessage(notification))
                .build();

        try {
            UserDTO sender = userClient.getUserById(notification.getSenderId());
            notificationDTO.setSender(sender);
        } catch (Exception e) {
            notificationDTO.setSender(null);
        }

        return notificationDTO;
=======
    private NotificationDTO convertToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .type(notification.getType())
                .referenceId(notification.getReferenceId())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .message(generateMessage(notification))
                .build();
>>>>>>> Stashed changes
    }

    private String generateMessage(Notification notification) {
        // Tạo message hiển thị dựa trên loại thông báo
        // Trong thực tế, bạn cần truy vấn thêm dữ liệu liên quan từ các bảng khác
        switch (notification.getType()) {
            case FRIEND_REQUEST:
<<<<<<< Updated upstream
                return "đã gửi cho bạn một lời mời kết bạn";
            case FRIEND_ACCEPT:
                return "đã chấp nhận lời mời kết bạn của bạn";
            case POST_LIKE:
                return "đã thích bài viết của bạn";
            case COMMENT_LIKE:
                return "đã thích bình luận của bạn";
            case POST_COMMENT:
                return "đã bình luận về bài viết của bạn";
            case COMMENT_REPLY:
                return "đã trả lời bình luận của bạn";
            case MENTION:
                return "đã nhắc đến bạn";
            case NEW_MESSAGE:
                return "đã gửi cho bạn một tin nhắn mới";
=======
                return "Bạn có một lời mời kết bạn mới";
            case FRIEND_ACCEPT:
                return "Ai đó đã chấp nhận lời mời kết bạn của bạn";
            case POST_LIKE:
                return "Ai đó đã thích bài viết của bạn";
            case COMMENT_LIKE:
                return "Ai đó đã thích bình luận của bạn";
            case POST_COMMENT:
                return "Ai đó đã bình luận về bài viết của bạn";
            case COMMENT_REPLY:
                return "Ai đó đã trả lời bình luận của bạn";
            case MENTION:
                return "Ai đó đã nhắc đến bạn";
>>>>>>> Stashed changes
            default:
                return "Bạn có một thông báo mới";
        }
    }

    @Override
    public void registerSession(String sessionId, Long userId, WebSocketSession session) {
        sessions.put(sessionId, session);
        sessionUserIds.put(sessionId, userId);
    }

    @Override
    public void unregisterSession(String sessionId) {
        sessions.remove(sessionId);
        sessionUserIds.remove(sessionId);
    }

    @Override
    public void sendNotificationToUser(Long userId, Notification notification) {
        try {
<<<<<<< Updated upstream
            String notificationJson = objectMapper.writeValueAsString(convertToDTO(notification));

=======
            // Chuyển đổi đối tượng Notification thành JSON string
            String notificationJson = objectMapper.writeValueAsString(convertToDTO(notification));

            // Gửi thông báo đến tất cả phiên của userId
>>>>>>> Stashed changes
            sessions.entrySet().stream()
                    .filter(entry -> userId.equals(sessionUserIds.get(entry.getKey())))
                    .forEach(entry -> {
                        WebSocketSession session = entry.getValue();
                        if (session != null && session.isOpen()) {
                            try {
                                session.sendMessage(new TextMessage(notificationJson));
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }
                    });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void sendNotificationToUser(Long userId, String message) {
        sessions.entrySet().stream()
                .filter(entry -> userId.equals(sessionUserIds.get(entry.getKey())))
                .forEach(entry -> {
                    WebSocketSession session = entry.getValue();
                    if (session != null && session.isOpen()) {
                        try {
                            session.sendMessage(new TextMessage(message));
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                });
    }

    @Override
    public Notification createAndSendNotification(NotificationRequest request) {
        Notification notification = createNotification(request);
        sendNotificationToUser(request.getUserId(), notification);
        return notification;
    }

    public Map<String, String> extractQueryParameters(WebSocketSession session) {
<<<<<<< Updated upstream
=======
        // Extract query parameters from the URI
>>>>>>> Stashed changes
        Map<String, String> params = new ConcurrentHashMap<>();

        String uri = session.getUri().toString();
        int queryStartIndex = uri.indexOf('?');

        if (queryStartIndex > 0) {
            String query = uri.substring(queryStartIndex + 1);
            String[] pairs = query.split("&");

            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    params.put(keyValue[0], keyValue[1]);
                }
            }
        }

        return params;
    }
}
