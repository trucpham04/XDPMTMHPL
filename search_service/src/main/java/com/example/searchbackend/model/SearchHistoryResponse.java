package com.example.searchbackend.model;

<<<<<<< Updated upstream
import lombok.Data;

@Data
public class SearchHistoryResponse {
    private Integer id;
    private String searchText;
    private User targetUser; // Người bị click
=======
public class SearchHistoryResponse {
    private Integer id;
    private String searchText;
    private User targetUser;   // Người bị click
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                    targetUser.getAvatarUrl());
        }
    }
=======
                    targetUser.getAvatarUrl()
            );
        }
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

    public User getTargetUser() {
        return targetUser;
    }

    public void setTargetUser(User targetUser) {
        this.targetUser = targetUser;
    }

    public Integer getSearcherId() {
        return searcherId;
    }

    public void setSearcherId(Integer searcherId) {
        this.searcherId = searcherId;
    }
>>>>>>> Stashed changes
}
