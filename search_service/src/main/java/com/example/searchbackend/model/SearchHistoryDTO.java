package com.example.searchbackend.model;

import java.time.LocalDateTime;
import java.util.List;

import com.example.searchbackend.dto.UserDTO;

import lombok.Data;

@Data
public class SearchHistoryDTO {

    private Integer id;
    private String searchText;
    private LocalDateTime createdAt;
    private Integer targetUserId;
    private UserDTO UserDTO;
    private List<PostResponseDTO> posts;
    private Integer userId;
    private String userName;
    private String avatar;

    public SearchHistoryDTO(Integer id, String searchText, LocalDateTime createdAt, Integer targetUserId,
            UserDTO UserDTO) {
        this.id = id;
        this.searchText = searchText;
        this.createdAt = createdAt;
        this.targetUserId = targetUserId;
        this.UserDTO = UserDTO;
    }
}
