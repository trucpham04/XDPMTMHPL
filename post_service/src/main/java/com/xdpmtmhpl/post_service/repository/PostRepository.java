package com.xdpmtmhpl.post_service.repository;

import com.xdpmtmhpl.post_service.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByUserId(Integer userId);

    List<Post> findByContentContainingIgnoreCase(String content);

    void deleteByPostId(Integer postId);
}
