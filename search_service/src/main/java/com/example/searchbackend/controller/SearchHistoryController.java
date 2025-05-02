
package com.example.searchbackend.controller;

import com.example.searchbackend.model.SearchHistoryDTO;
import com.example.searchbackend.service.SearchHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search/history")
public class SearchHistoryController {

    @Autowired
    private SearchHistoryService searchHistoryService;

    @PostMapping
    public ResponseEntity<String> saveSearch(
            @RequestParam(required = false) Integer searcherId,
            @RequestParam(required = false) Integer targetUserId,
            @RequestParam String searchText) {

        searchHistoryService.saveSearchHistory(searcherId, targetUserId, searchText);
        return ResponseEntity.ok("Search history saved successfully.");
    }

    @GetMapping("/recent")
    public ResponseEntity<List<SearchHistoryDTO>> getRecentSearches(
            @RequestParam Integer searcherId,
            @RequestParam(defaultValue = "8") Integer limit) {

        List<SearchHistoryDTO> recentSearches = searchHistoryService.getRecentSearchesByUser(searcherId, limit);
        return ResponseEntity.ok(recentSearches);
    }

    // ✅ Xóa 1 dòng lịch sử theo ID và searcherId
    @DeleteMapping("/{historyId}")
    public ResponseEntity<String> deleteHistoryByIdAndSearcherId(
            @PathVariable Integer historyId,
            @RequestParam(required = false, defaultValue = "0") Integer searcherId) {

        if (searcherId == 0) {
            return ResponseEntity.badRequest().body("Invalid 'searcherId' value");
        }

        searchHistoryService.deleteSearchHistoryByIdAndSearcherId(historyId, searcherId);
        return ResponseEntity.ok("Search history with ID " + historyId + " deleted.");
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> deleteUserHistory(@PathVariable Integer userId) {
        searchHistoryService.deleteSearchHistoryByUserId(userId);
        return ResponseEntity.ok("Search history for user " + userId + " deleted.");
    }

    @DeleteMapping("/all")
    public ResponseEntity<String> deleteAllHistory() {
        searchHistoryService.deleteAllSearchHistory();
        return ResponseEntity.ok("All search history deleted.");
    }
}
