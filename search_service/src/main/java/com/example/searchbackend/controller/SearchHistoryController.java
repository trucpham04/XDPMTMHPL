package com.example.searchbackend.controller;

import com.example.searchbackend.model.SearchHistory;
import com.example.searchbackend.model.SearchHistoryResponse;
import com.example.searchbackend.model.User;
import com.example.searchbackend.service.SearchHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class SearchHistoryController {

    @Autowired
    private SearchHistoryService searchHistoryService;

    // Endpoint để lưu lịch sử tìm kiếm
    @PostMapping("/search/history")
    public ResponseEntity<String> saveSearch(
            @RequestParam(required = false) Integer searcherId,
            @RequestParam(required = false) Integer userId,
            @RequestParam String searchText) {

        searchHistoryService.saveSearchHistory(searcherId, userId, searchText);
        return ResponseEntity.ok("Search history saved");
    }

    // Endpoint để lấy danh sách 8 người tìm kiếm gần nhất
    @GetMapping("/search/recent-users")
    public ResponseEntity<List<SearchHistoryResponse>> getTop8RecentSearches() {
        List<SearchHistoryResponse> recentSearches = searchHistoryService.getTop8RecentSearches();
        return ResponseEntity.ok(recentSearches);
    }

    // Endpoint để xóa lịch sử tìm kiếm của một người dùng
    @DeleteMapping("/search/history/user/{userId}")
    public ResponseEntity<String> deleteUserHistory(@PathVariable Integer userId) {
        searchHistoryService.deleteSearchHistoryByUserId(userId);
        return ResponseEntity.ok("Search history for user " + userId + " deleted");
    }

    // Endpoint để xóa một lịch sử tìm kiếm theo ID
    @DeleteMapping("/search/history/{id}")
    public ResponseEntity<String> deleteHistoryById(@PathVariable Integer id) {
        searchHistoryService.deleteSearchHistoryById(id);
        return ResponseEntity.ok("Search history with ID " + id + " deleted");
    }

    // Endpoint để xóa tất cả lịch sử tìm kiếm (CẨN THẬN khi sử dụng)
    @DeleteMapping("/search/history/all")
    public ResponseEntity<String> deleteAllHistory() {
        searchHistoryService.deleteAllSearchHistory();
        return ResponseEntity.ok("All search history deleted");
    }

}
