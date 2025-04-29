package com.example.searchbackend.repository;

import com.example.searchbackend.model.SearchHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Integer> {

    Optional<SearchHistory> findBySearcherIdAndTargetUserIdAndSearchText(Integer searcherId, Integer targetUserId, String searchText);

    Optional<SearchHistory> findBySearcherIdIsNullAndTargetUserIdAndSearchText(Integer targetUserId, String searchText);

    List<SearchHistory> findAllByOrderByCreatedAtDesc(Pageable pageable);

    void deleteByTargetUserId(Integer targetUserId);
}
