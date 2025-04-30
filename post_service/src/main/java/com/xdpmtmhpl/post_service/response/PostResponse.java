package com.xdpmtmhpl.post_service.response;

import com.xdpmtmhpl.post_service.model.MultiFile;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponse {
    private Integer postId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer userId;
    private String viewer;
    private List<MultiFile> multiFile;
}
