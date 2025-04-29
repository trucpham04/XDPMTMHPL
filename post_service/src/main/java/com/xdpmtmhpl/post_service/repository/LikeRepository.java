package com.xdpmtmhpl.post_service.repository;

import com.xdpmtmhpl.post_service.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Integer> {
    // Kiểm tra user đã like bài viết chưa
    boolean existsByPostIdAndUserId(Integer postId, Integer userId);

    // Đếm số lượt like của bài viết
    Long countByPostId(Integer postId);

    // Xóa like của user trên bài viết
    void deleteByPostIdAndUserId(Integer postId, Integer userId);

    // Lấy tất cả like của bài viết
    List<Like> findByPostId(Integer postId);

    // Lấy like cụ thể
    Optional<Like> findByPostIdAndUserId(Integer postId, Integer userId);
}