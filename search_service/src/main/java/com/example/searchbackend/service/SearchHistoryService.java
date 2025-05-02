
package com.example.searchbackend.service;

import com.example.searchbackend.model.SearchHistory;
import com.example.searchbackend.model.SearchHistoryDTO;
import com.example.searchbackend.client.UserClient;
import com.example.searchbackend.dto.UserDTO;
import com.example.searchbackend.model.PostResponseDTO;
import com.example.searchbackend.repository.SearchHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;
import org.springframework.http.HttpMethod;
import org.springframework.core.ParameterizedTypeReference;

@Service
public class SearchHistoryService {

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    // @Autowired
    // private RestTemplate restTemplate;

    @Autowired
    private UserClient userClient;

    // private final String userServiceBaseUrl = "http://user-service/api/users/";
    // // URL của UserService
    // private final String postServiceBaseUrl = "http://post-service/posts"; // URL
    // của PostService

    // Hàm này chuyển đổi SearchHistory thành SearchHistoryDTO, và lấy thông tin
    // user từ UserService
    private SearchHistoryDTO convertToDTO(SearchHistory history) {
        UserDTO targetUserDTO = null;

        if (history.getTargetUserId() != null) {
            // String userUrl = userServiceBaseUrl + history.getTargetUserId();
            try {
                // ResponseEntity<TargetUserDTO> response = restTemplate.getForEntity(userUrl,
                // TargetUserDTO.class);
                targetUserDTO = userClient.getUserById(history.getTargetUserId());
                // targetUserDTO = response.getBody();
            } catch (Exception e) {
                e.printStackTrace();
                // targetUserDTO = new TargetUserDTO();
                // targetUserDTO.setUserId(history.getTargetUserId());
            }
        }

        // List<PostResponseDTO> posts = getPostsByUserId(history.getTargetUserId());

        // ✳️ Nếu DTO SearchHistoryDTO có constructor phù hợp, dùng constructor
        return new SearchHistoryDTO(history.getId(), history.getSearchText(), history.getCreatedAt(),
                history.getTargetUserId(),
                targetUserDTO);
    }

    // Lấy các bài viết của người dùng từ PostService
    // private List<PostResponseDTO> getPostsByUserId(Integer userId) {
    // String url = postServiceBaseUrl + "?userId=" + userId;

    // try {
    // ResponseEntity<List<PostResponseDTO>> response = restTemplate.exchange(
    // url,
    // HttpMethod.GET,
    // null,
    // new ParameterizedTypeReference<List<PostResponseDTO>>() {
    // });
    // return response.getBody();
    // } catch (Exception e) {
    // e.printStackTrace();
    // return Collections.emptyList();
    // }
    // }

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

    public List<SearchHistoryDTO> getRecentSearchesByUser(Integer searcherId, Integer limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<SearchHistory> histories = searchHistoryRepository.findBySearcherIdOrderByCreatedAtDesc(searcherId,
                pageable);
        return histories.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public void deleteSearchHistoryByIdAndSearcherId(Integer historyId, Integer searcherId) {
        SearchHistory history = searchHistoryRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("Search history not found"));

        if (!history.getSearcherId().equals(searcherId)) {
            throw new RuntimeException("Not authorized to delete this search history");
        }

        searchHistoryRepository.deleteById(historyId);
    }

    public void deleteSearchHistoryByUserId(Integer id) {
        searchHistoryRepository.deleteById(id);
    }

    public void deleteAllSearchHistory() {
        searchHistoryRepository.deleteAll();
    }
}
