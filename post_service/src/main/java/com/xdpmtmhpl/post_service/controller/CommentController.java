package com.xdpmtmhpl.post_service.controller;

import com.xdpmtmhpl.post_service.models.User;
import com.xdpmtmhpl.post_service.models.Comment;
import com.xdpmtmhpl.post_service.services.CommentService;
import com.xdpmtmhpl.post_service.payload.request.CommentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Lấy tất cả cmt
    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        List<Comment> comments = commentService.getAllComments();
        return ResponseEntity.ok(comments);
    }

    // Lấy cmt theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long id) {
        Comment comment = commentService.getCommentById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        return ResponseEntity.ok(comment);
    }

    // Lấy tất cả cmt của 1 post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable Long postId) {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    // Tạo cmt mới
    @PostMapping("/post/{postId}")
    public ResponseEntity<Comment> createComment(@PathVariable Long postId,
            @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal User userDetails) {
        User user = (User) userDetails;
        Comment comment = commentService.createComment(commentRequest.getContent(), postId, user.getId());
        return ResponseEntity.ok(comment);
    }

    // Xóa cmt
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id,
            @AuthenticationPrincipal User userDetails) {
        Comment comment = commentService.getCommentById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        User user = (User) userDetails;
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }
        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }
}