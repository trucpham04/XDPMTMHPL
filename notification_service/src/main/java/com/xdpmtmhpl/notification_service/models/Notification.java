package com.xdpmtmhpl.notification_service.models;

import com.xdpmtmhpl.notification_service.dto.UserDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "sender_id")
    private String senderId;

    @Transient
    private UserDTO sender;

    @Column(name = "type")
    private String type;

    @Column(name = "title")
    private String title;

    @Column(name = "message")
    private String message;

    @Column(name = "is_read")
    @JsonProperty("read")
    @Builder.Default
    private boolean read = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}