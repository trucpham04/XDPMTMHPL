package com.example.searchbackend.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SearchHistoryDTO {
    private Integer id;
    private String searchText;
    private LocalDateTime createdAt;

    private Integer userId;
    private String userName;
    private String avatar;
}
