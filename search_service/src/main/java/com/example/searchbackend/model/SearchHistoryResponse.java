package com.example.searchbackend.model;

import lombok.Data;

@Data
public class SearchHistoryResponse {
    private Integer id;
    private String searchText;
    private User targetUser; // Người bị click
    private Integer searcherId; // Người đang đăng nhập

    public SearchHistoryResponse(SearchHistory history, User targetUser) {
        this.id = history.getId();
        this.searchText = history.getSearchText();
        this.searcherId = history.getSearcherId();

        if (targetUser != null) {
            this.targetUser = new User(
                    targetUser.getId(),
                    targetUser.getFirstName(),
                    targetUser.getLastName(),
                    targetUser.getAvatarUrl());
        }
    }
}
