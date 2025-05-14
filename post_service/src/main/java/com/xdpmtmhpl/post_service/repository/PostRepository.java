package com.xdpmtmhpl.post_service.repository;

import com.xdpmtmhpl.post_service.model.Post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByUserId(Integer userId);

    List<Post> findByContentContainingIgnoreCase(String content);

    void deleteByPostId(Integer postId);

    Page<Post> findAll(Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.multiFile mf WHERE p.userId = :userId AND mf.type = 'image'")
    List<Post> findAllPostsWithImagesByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Post p JOIN p.multiFile mf WHERE p.userId = :userId AND mf.type = 'video'")
    List<Post> findAllPostsWithVideosByUserId(@Param("userId") Long userId);
}
