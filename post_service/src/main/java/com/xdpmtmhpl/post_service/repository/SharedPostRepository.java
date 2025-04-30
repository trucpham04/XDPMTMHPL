package com.xdpmtmhpl.post_service.repository;

import com.xdpmtmhpl.post_service.model.SharedPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SharedPostRepository extends JpaRepository<SharedPost, Integer> {
    List<SharedPost> findByOriginalPostId(Integer postId);
    List<SharedPost> findByUserId(Integer userId);

}