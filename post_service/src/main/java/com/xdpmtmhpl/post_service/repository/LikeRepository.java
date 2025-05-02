package com.xdpmtmhpl.post_service.repository;

import com.xdpmtmhpl.post_service.models.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findByPostId(Long postId);
    Optional<Like> findByPostIdAndUserId(Long postId, Long userId);
}