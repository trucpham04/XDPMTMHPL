package com.xdpmtmhpl.post_service.response;

import lombok.Data;

import java.time.LocalDateTime;

import com.xdpmtmhpl.post_service.DTO.UserDTO;

@Data
public class ShareResponse {
    private Integer sharedPostId;
    private Integer originalPostId;
    private Long userId;
    private LocalDateTime createdAt;
    private String content;
    private String viewer;
    private PostResponse originalPost;
    private UserDTO author;
}
