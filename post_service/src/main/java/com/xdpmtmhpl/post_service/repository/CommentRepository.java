// package com.xdpmtmhpl.post_service.repository;

// import com.xdpmtmhpl.post_service.models.Comment;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// import java.util.List;

// @Repository
// public interface CommentRepository extends JpaRepository<Comment, Long> {
//     // Tìm tất cả bình luận của 1 post theo postId
//     List<Comment> findByPostId(Long postId);

//     // Tìm tất cả bình luận của 1 user theo userId
//     List<Comment> findByUserId(Long userId);
// }
package com.xdpmtmhpl.post_service.repository;

import com.xdpmtmhpl.post_service.models.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByPostId(Long postId, Pageable pageable);
}