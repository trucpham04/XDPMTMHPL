package com.example.searchbackend.model;

import java.time.LocalDateTime;

public class SearchHistoryDTO {
    private Integer id;
    private String searchText;
    private LocalDateTime createdAt;

    private Integer userId;
    private String userName;
    private String avatar;

    public SearchHistoryDTO() {
    }

    public SearchHistoryDTO(Integer id, String searchText, LocalDateTime createdAt,
                            Integer userId, String userName, String avatar) {
        this.id = id;
        this.searchText = searchText;
        this.createdAt = createdAt;
        this.userId = userId;
        this.userName = userName;
        this.avatar = avatar;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}
