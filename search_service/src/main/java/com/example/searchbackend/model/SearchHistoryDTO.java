package com.example.searchbackend.model;

import java.time.LocalDateTime;
import java.util.List;

public class SearchHistoryDTO {

    private String searchText;
    private LocalDateTime createdAt;
    private Integer targetUserId;
    private TargetUserDTO targetUserDTO;  // Khai báo targetUserDTO
    private List<Post> posts;  // Khai báo posts

    // Constructor
    public SearchHistoryDTO(String searchText, LocalDateTime createdAt, Integer targetUserId, TargetUserDTO targetUserDTO, List<Post> posts) {
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

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }
}
