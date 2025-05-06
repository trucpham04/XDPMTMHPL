package com.xdpmtmhpl.post_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.Cascade;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Integer postId;

    @Column(name = "content", length = 255)
    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "viewer", nullable = false)
    private String viewer;

    @ElementCollection
    @CollectionTable(name = "post_files", joinColumns = @JoinColumn(name = "post_id"))
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<MultiFile> multiFile;
}