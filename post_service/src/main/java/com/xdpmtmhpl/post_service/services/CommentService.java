package com.xdpmtmhpl.post_service.services;

import com.xdpmtmhpl.post_service.models.Comment;
import com.xdpmtmhpl.post_service.models.Post;
import com.xdpmtmhpl.post_service.models.User;
import com.xdpmtmhpl.post_service.repository.CommentRepository;
import com.xdpmtmhpl.post_service.repository.PostRepository;
import com.xdpmtmhpl.post_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentsRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // Lấy tất cả cmt
    public List<Comment> getAllComments() {
        return commentsRepository.findAll();
    }

    // Lấy cmt theo ID
    public Optional<Comment> getCommentById(Long id) {
        return commentsRepository.findById(id);
    }

    // Lấy tất cả cmt của 1 post
    public List<Comment> getCommentsByPostId(Long postId) {
        return commentsRepository.findByPostId(postId);
    }

    // Lấy danh sách bình luận của một user
    public List<Comment> getCommentsByUserId(Long userId) {
        return commentsRepository.findByUserId(userId);
    }

    // Tạo 1 cmt
    public Comment createComment(String content, Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);
        return commentsRepository.save(comment);
    }

    // Xóa bình luận
    public void deleteComment(Long id) {
        if (!commentsRepository.existsById(id)) {
            throw new RuntimeException("Comment not found with id: " + id);
        }
        commentsRepository.deleteById(id);
    }
}