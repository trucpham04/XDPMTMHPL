
package com.example.searchbackend.model;


public class SearchHistoryResponse {
    private String searchText;
    private TargetUserDTO targetUser;  // Người bị click
    private Integer searcherId; // Người đang đăng nhập

    public SearchHistoryResponse() {}

    public SearchHistoryResponse(String searchText, TargetUserDTO targetUser, Integer searcherId) {
        this.searchText = searchText;
        this.targetUser = targetUser;
        this.searcherId = searcherId;
    }

    public String getSearchText() {
        return searchText;
    }

    public void setSearchText(String searchText) {
        this.searchText = searchText;
    }

    public TargetUserDTO getTargetUser() {
        return targetUser;
    }

    public void setTargetUser(TargetUserDTO targetUser) {
        this.targetUser = targetUser;
    }

    public Integer getSearcherId() {
        return searcherId;
    }

    public void setSearcherId(Integer searcherId) {
        this.searcherId = searcherId;
    }
}
