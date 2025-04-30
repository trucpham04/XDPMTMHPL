package com.xdpmtmhpl.notification_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xdpmtmhpl.notification_service.enums.NotificationType;
import com.xdpmtmhpl.notification_service.models.Notification;

import java.time.LocalDateTime;
<<<<<<< Updated upstream
=======
import java.util.List;
>>>>>>> Stashed changes

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

<<<<<<< Updated upstream
=======
    List<Notification> findByUserIdAndIsReadFalse(Long userId);

>>>>>>> Stashed changes
    Page<Notification> findByUserIdAndType(Long userId, NotificationType type, Pageable pageable);

    Page<Notification> findByUserIdAndCreatedAtAfter(Long userId, LocalDateTime time, Pageable pageable);

<<<<<<< Updated upstream
=======
    long countByUserIdAndIsReadFalse(Long userId);
>>>>>>> Stashed changes
}
