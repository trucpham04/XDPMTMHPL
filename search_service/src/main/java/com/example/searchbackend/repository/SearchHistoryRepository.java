
package com.example.searchbackend.repository;

import com.example.searchbackend.model.SearchHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Integer> {

    /**
     * Tìm bản ghi lịch sử tìm kiếm theo searcherId, targetUserId và searchText.
     * Dùng để kiểm tra bản ghi trùng lặp trước khi lưu.
     */
    Optional<SearchHistory> findBySearcherIdAndTargetUserIdAndSearchText(
            Integer searcherId,
            Integer targetUserId,
            String searchText
    );

    /**
     * Tìm bản ghi nếu searcherId là null (dành cho người không đăng nhập).
     */
    Optional<SearchHistory> findBySearcherIdIsNullAndTargetUserIdAndSearchText(
            Integer targetUserId,
            String searchText
    );

    /**
     * Lấy danh sách lịch sử tìm kiếm theo searcherId, sắp xếp theo thời gian mới nhất.
     */
    List<SearchHistory> findBySearcherIdOrderByCreatedAtDesc(
            Integer searcherId,
            Pageable pageable
    );

    /**
     * Xóa lịch sử tìm kiếm theo ID và searcherId để đảm bảo người dùng chỉ xóa được lịch sử của chính họ.
     */
    @Transactional
    @Modifying
    @Query("DELETE FROM SearchHistory h WHERE h.id = :historyId AND h.searcherId = :searcherId")
    void deleteByIdAndSearcherId(Integer historyId, Integer searcherId);

    /**
     * Xóa tất cả lịch sử liên quan đến 1 người dùng cụ thể (thường dùng khi người dùng bị xóa).
     */
    @Transactional
    @Modifying
    void deleteByTargetUserId(Integer targetUserId);
}
