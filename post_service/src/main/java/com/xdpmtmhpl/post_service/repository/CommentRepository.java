package com.xdpmtmhpl.post_service.repository;

import com.xdpmtmhpl.post_service.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost_PostId(Integer postId);

    Integer countByPost_PostId(Integer postId);

    void deleteByPost_PostId(Integer postId);

    void deleteByCommentId(Long commentId);

}