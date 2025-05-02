package com.xdpmtmhpl.post_service.controller;

import com.xdpmtmhpl.post_service.model.Post;
import com.xdpmtmhpl.post_service.request.PostRequest;
import com.xdpmtmhpl.post_service.response.PostResponse;
import com.xdpmtmhpl.post_service.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostRequest postRequest) {
        Post post = new Post();
        post.setUserId(postRequest.getUserId());
        post.setContent(postRequest.getContent());
        post.setCreatedAt(postRequest.getCreatedAt());
        post.setUpdatedAt(postRequest.getUpdatedAt());
        post.setViewer(postRequest.getViewer());
        post.setMultiFile(postRequest.getMultiFile());
        Post createdPost = postService.createPost(post);
        return ResponseEntity.ok(toResponse(createdPost));
    }


    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Integer postId) {
        Post post = postService.getPostById(postId);
        return ResponseEntity.ok(toResponse(post));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getPostsByUserId(@PathVariable Integer userId) {
        List<Post> posts = postService.getPostsByUserId(userId);
        List<PostResponse> responseList = posts.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Integer postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    // Chuyển đổi từ Entity sang DTO
    private PostResponse toResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setPostId(post.getPostId());
        response.setUserId(post.getUserId());
        response.setContent(post.getContent());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        response.setViewer(post.getViewer());
        response.setMultiFile(post.getMultiFile());
        return response;
    }
}
