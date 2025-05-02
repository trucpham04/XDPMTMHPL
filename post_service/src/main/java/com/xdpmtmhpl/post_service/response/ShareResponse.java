package com.xdpmtmhpl.post_service.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ShareResponse {
    private Integer sharedPostId;
    private Integer originalPostId;
    private Integer userId;
    private String content;
    private String viewer;
    private LocalDateTime createdAt;
}
