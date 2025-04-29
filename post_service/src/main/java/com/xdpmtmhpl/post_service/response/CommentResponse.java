package com.xdpmtmhpl.post_service.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long commentId;
    private Long userId;
    private String content;
    private Integer postId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
