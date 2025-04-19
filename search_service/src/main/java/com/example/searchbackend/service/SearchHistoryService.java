package com.example.searchbackend.service;

import com.example.searchbackend.model.SearchHistoryResponse;
import com.example.searchbackend.model.User;
import com.example.searchbackend.model.SearchHistory;
import com.example.searchbackend.repository.SearchHistoryRepository;
import com.example.searchbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchHistoryService {

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    public void saveSearchHistory(Integer searcherId, Integer targetUserId, String searchText) {
        if (searcherId != null) {
            searchHistoryRepository
                    .findBySearcherIdAndTargetUserIdAndSearchText(searcherId, targetUserId, searchText)
                    .ifPresent(existing -> searchHistoryRepository.deleteById(existing.getId()));
        } else {
            searchHistoryRepository
                    .findBySearcherIdIsNullAndTargetUserIdAndSearchText(targetUserId, searchText)
                    .ifPresent(existing -> searchHistoryRepository.deleteById(existing.getId()));
        }

        SearchHistory searchHistory = new SearchHistory();
        searchHistory.setSearcherId(searcherId);
        searchHistory.setTargetUserId(targetUserId);
        searchHistory.setSearchText(searchText);
        searchHistory.setCreatedAt(LocalDateTime.now());

        searchHistoryRepository.save(searchHistory);
    }

    public List<SearchHistoryResponse> getTop8RecentSearches() {
        Pageable pageable = PageRequest.of(0, 8);
        List<SearchHistory> histories = searchHistoryRepository.findAllByOrderByCreatedAtDesc(pageable);

        return histories.stream().map(history -> {
            User user = null;
            if (history.getTargetUserId() != null) {
                user = userRepository.findById(history.getTargetUserId()).orElse(null);
            }
            return new SearchHistoryResponse(history, user);
        }).collect(Collectors.toList());
    }

    public void deleteSearchHistoryByUserId(Integer userId) {
        searchHistoryRepository.deleteByTargetUserId(userId);
    }

    public void deleteSearchHistoryById(Integer id) {
        searchHistoryRepository.deleteById(id);
    }

    public void deleteAllSearchHistory() {
        searchHistoryRepository.deleteAll();
    }
}
