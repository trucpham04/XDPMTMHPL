package com.xdpmtmhpl.post_service.request;

import lombok.Data;

@Data
public class ShareRequest {
    private Long userId;
    private String content;
    private String viewer;
}
