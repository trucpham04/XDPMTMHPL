package com.xdpmtmhpl.post_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long id;
    private Long postId;
    private Long userId;
    private String username;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}