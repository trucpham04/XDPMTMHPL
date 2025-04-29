package com.example.searchbackend.model;

import java.time.LocalDateTime;
import java.util.List;

public class SearchHistoryDTO {

    private String searchText;
    private LocalDateTime createdAt;
    private Integer targetUserId;
    private TargetUserDTO targetUserDTO;
    private List<PostResponseDTO> posts; 

    // Constructor
    public SearchHistoryDTO(String searchText, LocalDateTime createdAt, Integer targetUserId, TargetUserDTO targetUserDTO, List<PostResponseDTO> posts) {
        this.searchText = searchText;
        this.createdAt = createdAt;
        this.targetUserId = targetUserId;
        this.targetUserDTO = targetUserDTO;
        this.posts = posts;
    }

    // Getter và Setter
    public String getSearchText() {
        return searchText;
    }

    public void setSearchText(String searchText) {
        this.searchText = searchText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(Integer targetUserId) {
        this.targetUserId = targetUserId;
    }

    public TargetUserDTO getTargetUserDTO() {
        return targetUserDTO;
    }

    public void setTargetUserDTO(TargetUserDTO targetUserDTO) {
        this.targetUserDTO = targetUserDTO;
    }

    public List<PostResponseDTO> getPosts() {
        return posts;
    }

    public void setPosts(List<PostResponseDTO> posts) {
        this.posts = posts;
    }
}
