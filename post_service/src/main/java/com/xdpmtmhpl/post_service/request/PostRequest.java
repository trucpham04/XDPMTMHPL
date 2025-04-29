package com.xdpmtmhpl.post_service.request;

import com.xdpmtmhpl.post_service.model.MultiFile;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostRequest {
    private Integer userId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MultiFile> multiFile;
    private String viewer;

    public PostRequest() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
