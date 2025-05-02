package com.xdpmtmhpl.post_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LikeDTO {
    private Integer id;
    private Long postId;
    private Long userId;
    private String username;
    private LocalDateTime createdAt;
}