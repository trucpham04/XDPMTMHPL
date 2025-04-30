package com.example.searchbackend.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class SearchHistoryDTO {

    private String searchText;
    private LocalDateTime createdAt;
    private Integer targetUserId;
    private TargetUserDTO targetUserDTO;
    private List<PostResponseDTO> posts; 
    private Integer userId;
    private String userName;
    private String avatar;
}
