
    package com.example.searchbackend.service;

    import com.example.searchbackend.model.SearchHistory;
    import com.example.searchbackend.model.SearchHistoryDTO;
    import com.example.searchbackend.model.TargetUserDTO;
    import com.example.searchbackend.model.Post;
    import com.example.searchbackend.repository.SearchHistoryRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.data.domain.PageRequest;
    import org.springframework.data.domain.Pageable;
    import org.springframework.stereotype.Service;
    import org.springframework.web.client.RestTemplate;
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

        @Autowired
        private RestTemplate restTemplate;

        private final String userServiceBaseUrl = "http://user-service/api/users/";  // URL của UserService
        private final String postServiceBaseUrl = "http://post-service/posts";       // URL của PostService

        // Hàm này chuyển đổi SearchHistory thành SearchHistoryDTO, và lấy thông tin user từ UserService
        private SearchHistoryDTO convertToDTO(SearchHistory history) {
            TargetUserDTO targetUserDTO = null;
            
            // Lấy thông tin từ UserService nếu có targetUserId
            if (history.getTargetUserId() != null) {
                String userUrl = userServiceBaseUrl + history.getTargetUserId();
                try {
                    ResponseEntity<TargetUserDTO> response = restTemplate.getForEntity(userUrl, TargetUserDTO.class);
                    targetUserDTO = response.getBody();
                } catch (Exception e) {
                    e.printStackTrace();
                    targetUserDTO = new TargetUserDTO();
                    targetUserDTO.setUserId(history.getTargetUserId());
                }
            }

            // Lấy bài viết từ PostService
            List<Post> posts = getPostsByUserId(history.getTargetUserId());

            return new SearchHistoryDTO(history.getSearchText(), history.getCreatedAt(), history.getTargetUserId(), targetUserDTO, posts);
        }

        // Lấy các bài viết của người dùng từ PostService
        private List<Post> getPostsByUserId(Integer userId) {
            String url = postServiceBaseUrl + "?userId=" + userId;  // Giả sử PostService hỗ trợ lọc theo userId

            try {
                ResponseEntity<List<Post>> response = restTemplate.exchange(
                        url, HttpMethod.GET, null, new ParameterizedTypeReference<List<Post>>() {});
                return response.getBody();
            } catch (Exception e) {
                e.printStackTrace();
                return Collections.emptyList();
            }
        }

        // Lưu lịch sử tìm kiếm
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

        // Lấy lịch sử tìm kiếm gần đây theo searcherId và giới hạn số lượng
        public List<SearchHistoryDTO> getRecentSearchesByUser(Integer searcherId, Integer limit) {
            Pageable pageable = PageRequest.of(0, limit);
            List<SearchHistory> histories = searchHistoryRepository.findBySearcherIdOrderByCreatedAtDesc(searcherId, pageable);
            return histories.stream().map(this::convertToDTO).collect(Collectors.toList());
        }

        // Xóa 1 dòng lịch sử tìm kiếm (theo historyId và searcherId)
        public void deleteSearchHistoryByIdAndSearcherId(Integer historyId, Integer searcherId) {
            SearchHistory history = searchHistoryRepository.findById(historyId)
                    .orElseThrow(() -> new RuntimeException("Search history not found"));

            if (!history.getSearcherId().equals(searcherId)) {
                throw new RuntimeException("Not authorized to delete this search history");
            }

            searchHistoryRepository.deleteById(historyId);
        }

        // Xóa lịch sử tìm kiếm theo userId
        public void deleteSearchHistoryByUserId(Integer id) {
            searchHistoryRepository.deleteById(id);
        }

        // Xóa tất cả lịch sử tìm kiếm
        public void deleteAllSearchHistory() {
            searchHistoryRepository.deleteAll();
        }
    }

