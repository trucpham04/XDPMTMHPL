package com.xdpmtmhpl.post_service.service;

import com.xdpmtmhpl.post_service.model.Comment;
import com.xdpmtmhpl.post_service.response.CommentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    private RestTemplate restTemplate;

    private static final String BASE_URL = "http://localhost:8083";

    public CommentResponse addComment(Integer postId, Comment comment) {
        try {
            Comment saved = restTemplate.postForObject(BASE_URL + "/api/comments/" + postId, comment, Comment.class);
            return toResponse(saved);
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to add comment: " + e.getMessage());
        }
    }

    public void deleteComment(Long commentId) {
        try {
            restTemplate.delete(BASE_URL + "/api/comments/" + commentId);
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to delete comment: " + e.getMessage());
        }
    }

    public List<CommentResponse> getCommentsByPostId(Integer postId) {
        try {
            Comment[] comments = restTemplate.getForObject(BASE_URL + "/api/comments/post/" + postId, Comment[].class);
            List<CommentResponse> responses = new ArrayList<>();
            if (comments != null) {
                Arrays.stream(comments).forEach(comment -> responses.add(toResponse(comment)));
            }
            return responses;
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch comments: " + e.getMessage());
        }
    }

    private CommentResponse toResponse(Comment comment) {
        CommentResponse res = new CommentResponse();
        res.setCommentId(comment.getCommentId());
        res.setContent(comment.getContent());
        res.setUserId(comment.getUserId());
        res.setCreatedAt(comment.getCreatedAt());
        res.setUpdatedAt(comment.getUpdatedAt());
        res.setPostId(comment.getPost().getPostId());
        return res;
    }
}
