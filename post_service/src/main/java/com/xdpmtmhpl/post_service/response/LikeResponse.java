package com.xdpmtmhpl.post_service.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LikeResponse {
    private Integer likeId;
    private Integer postId;
    private Integer userId;
    private LocalDateTime createdAt;
}
