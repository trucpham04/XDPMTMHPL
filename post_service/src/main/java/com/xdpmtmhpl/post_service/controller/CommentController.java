package com.xdpmtmhpl.post_service.controller;

import com.xdpmtmhpl.post_service.model.Comment;
import com.xdpmtmhpl.post_service.model.Post;
import com.xdpmtmhpl.post_service.request.CommentRequest;
import com.xdpmtmhpl.post_service.response.CommentResponse;
import com.xdpmtmhpl.post_service.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PostMapping("/{postId}")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Integer postId,
            @RequestBody CommentRequest commentRequest
    ) {
        Comment comment = new Comment();
        comment.setUserId(commentRequest.getUserId());
        comment.setContent(commentRequest.getContent());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());

        // Gán post để mapping id trong response
        Post post = new Post();
        post.setPostId(postId);
        comment.setPost(post);

        CommentResponse savedComment = commentService.addComment(postId, comment);
        return ResponseEntity.ok(savedComment);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable Integer postId) {
        List<CommentResponse> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }
}
