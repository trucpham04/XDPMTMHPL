package com.xdpmtmhpl.post_service.response;

import lombok.Data;

import java.time.LocalDateTime;

import com.xdpmtmhpl.post_service.DTO.UserDTO;

@Data
public class CommentResponse {
    private Long commentId;
    private Long userId;
    private String content;
    private Integer postId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDTO user;
}
