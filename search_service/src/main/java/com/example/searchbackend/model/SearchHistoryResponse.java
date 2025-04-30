package com.example.searchbackend.model;

public class SearchHistoryResponse {
    private Integer id;
    private String searchText;
    private TargetUserDTO targetUser;
    private Integer searcherId;

    public SearchHistoryResponse() {}

    public SearchHistoryResponse(String searchText, TargetUserDTO targetUser, Integer searcherId) {
        this.searchText = searchText;
        this.targetUser = targetUser;
        this.searcherId = searcherId;
    }

    public SearchHistoryResponse(SearchHistory history, TargetUserDTO targetUserDto) {
        this.id = history.getId();
        this.searchText = history.getSearchText();
        this.searcherId = history.getSearcherId();
        this.targetUser = targetUserDto;
    }

    // Getters & Setters
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
