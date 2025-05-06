package com.xdpmtmhpl.post_service.response;

import com.xdpmtmhpl.post_service.DTO.UserDTO;
import com.xdpmtmhpl.post_service.model.MultiFile;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponse {
    private Integer postId;
    private Long userId;
    private String content;
    private List<MultiFile> multiFile;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer likes;
    private Integer comments;
    private Integer shares;
    private Boolean isLiked;
    private String viewer;
    private UserDTO author;
}
