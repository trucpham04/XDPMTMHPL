package com.xdpmtmhpl.post_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "shared_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SharedPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shared_post_id")
    private Integer sharedPostId;

    @Column(name = "original_post_id")
    private Integer originalPostId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "created_at") // Thêm cột created_at
    private LocalDateTime createdAt;

    @Column(name = "content", columnDefinition = "TEXT") // Thêm cột content
    private String content;

    @Column(name = "viewer") // Thêm cột viewer
    private String viewer;

    // Getter và Setter cho createdAt
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Getter và Setter cho content
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    // Getter và Setter cho viewer
    public String getViewer() {
        return viewer;
    }

    public void setViewer(String viewer) {
        this.viewer = viewer;
    }
}