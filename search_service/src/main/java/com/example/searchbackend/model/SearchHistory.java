
package com.example.searchbackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
public class SearchHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "searcher_id")
    private Integer searcherId;

    @Column(name = "target_user_id")
    private Integer targetUserId;

    @Column(name = "search_text")
    private String searchText;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public SearchHistory() {}

    public SearchHistory(Integer searcherId, Integer targetUserId, String searchText) {
        this.searcherId = searcherId;
        this.targetUserId = targetUserId;
        this.searchText = searchText;
        this.createdAt = LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getSearcherId() {
        return searcherId;
    }

    public void setSearcherId(Integer searcherId) {
        this.searcherId = searcherId;
    }

    public Integer getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(Integer targetUserId) {
        this.targetUserId = targetUserId;
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
}
