package com.xdpmtmhpl.post_service.controller;

import com.xdpmtmhpl.post_service.request.LikeRequest;
import com.xdpmtmhpl.post_service.response.LikeResponse;
import com.xdpmtmhpl.post_service.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping
    public ResponseEntity<LikeResponse> likePost(
            @PathVariable Integer postId,
            @RequestBody LikeRequest likeRequest
    ) {
        LikeResponse response = likeService.likePost(postId, likeRequest.getUserId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Void> unlikePost(
            @PathVariable Integer postId,
            @RequestParam Integer userId
    ) {
        likeService.unlikePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countLikes(@PathVariable Integer postId) {
        Long count = likeService.countLikesByPostId(postId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkUserLiked(
            @PathVariable Integer postId,
            @RequestParam Integer userId
    ) {
        boolean isLiked = likeService.checkUserLiked(postId, userId);
        return ResponseEntity.ok(isLiked);
    }

    @GetMapping
    public ResponseEntity<List<LikeResponse>> getLikes(@PathVariable Integer postId) {
        List<LikeResponse> likes = likeService.getLikesByPostId(postId);
        return ResponseEntity.ok(likes);
    }
}
