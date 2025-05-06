package com.xdpmtmhpl.post_service.service;

import com.xdpmtmhpl.post_service.Client.UserClient;
import com.xdpmtmhpl.post_service.DTO.UserDTO;
import com.xdpmtmhpl.post_service.model.Comment;
import com.xdpmtmhpl.post_service.model.Post;
import com.xdpmtmhpl.post_service.repository.CommentRepository;
import com.xdpmtmhpl.post_service.repository.PostRepository;
import com.xdpmtmhpl.post_service.request.CommentRequest;
import com.xdpmtmhpl.post_service.response.CommentResponse;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserClient userClient;

    public CommentResponse addComment(Integer postId, CommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));

        Comment comment = new Comment();
        comment.setUserId(request.getUserId());
        comment.setContent(request.getContent());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        comment.setPost(post);

        Comment saved = commentRepository.save(comment);
        return toResponse(saved);
    }

    public List<CommentResponse> getCommentsByPostId(Integer postId) {
        return commentRepository.findByPost_PostId(postId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new RuntimeException("Comment not found with ID: " + commentId);
        }
        commentRepository.deleteById(commentId);
    }

    private CommentResponse toResponse(Comment comment) {
        CommentResponse res = new CommentResponse();
        res.setCommentId(comment.getCommentId());
        res.setPostId(comment.getPost().getPostId());
        res.setUserId(comment.getUserId());
        res.setContent(comment.getContent());
        res.setCreatedAt(comment.getCreatedAt());
        res.setUpdatedAt(comment.getUpdatedAt());
        UserDTO user = userClient.getUserById(comment.getUserId());
        if (user == null) {
            throw new RuntimeException("User not found with ID: " + comment.getUserId());
        }
        res.setUser(userClient.getUserById(comment.getUserId()));
        return res;
    }
}
