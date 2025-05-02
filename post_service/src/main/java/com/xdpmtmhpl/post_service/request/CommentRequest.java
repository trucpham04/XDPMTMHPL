package com.xdpmtmhpl.post_service.request;

import lombok.Data;

@Data
public class CommentRequest {
    private Long userId;
    private String content;
}