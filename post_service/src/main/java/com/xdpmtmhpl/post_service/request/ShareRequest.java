package com.xdpmtmhpl.post_service.request;

import lombok.Data;

@Data
public class ShareRequest {
    private Integer userId;
    private String content;
    private String viewer;
}
