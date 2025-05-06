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

    // Like bài viết
    @PostMapping
    public ResponseEntity<LikeResponse> likePost(
            @PathVariable Integer postId,
            @RequestBody LikeRequest likeRequest) {
        LikeResponse response = likeService.likePost(likeRequest, postId);
        return ResponseEntity.ok(response);
    }

    // Bỏ like bài viết
    @DeleteMapping
    public ResponseEntity<Void> unlikePost(
            @PathVariable Integer postId,
            @RequestParam Integer userId) {
        likeService.unlikePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    // Đếm số lượt like của bài viết
    @GetMapping("/count")
    public ResponseEntity<Integer> countLikes(@PathVariable Integer postId) {
        Integer count = likeService.countLikesByPostId(postId);
        return ResponseEntity.ok(count);
    }

    // Kiểm tra người dùng đã like bài viết chưa
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkUserLiked(
            @PathVariable Integer postId,
            @RequestParam Integer userId) {
        boolean isLiked = likeService.checkUserLiked(postId, userId);
        return ResponseEntity.ok(isLiked);
    }

    // Lấy tất cả like của bài viết
    @GetMapping
    public ResponseEntity<List<LikeResponse>> getLikes(@PathVariable Integer postId) {
        List<LikeResponse> likes = likeService.getLikesByPostId(postId);
        return ResponseEntity.ok(likes);
    }
}
