package com.xdpmtmhpl.post_service.service;

import com.xdpmtmhpl.post_service.Client.NotificationClient;
import com.xdpmtmhpl.post_service.model.Like;
import com.xdpmtmhpl.post_service.repository.LikeRepository;
import com.xdpmtmhpl.post_service.request.LikeRequest;
import com.xdpmtmhpl.post_service.response.LikeResponse;
import com.xdpmtmhpl.post_service.enums.NotificationType;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private NotificationClient notificationClient;

    @Autowired
    private PostService postService;

    // Thích bài viết
    public LikeResponse likePost(LikeRequest likeRequest, Integer postId) {
        Like like = new Like();
        like.setPostId(postId);
        like.setUserId(likeRequest.getUserId());
        like = likeRepository.save(like);

        var post = postService.getPostById(postId);
        if (post != null && !post.getUserId().equals(likeRequest.getUserId())) {
            notificationClient.sendNotification(
                    post.getUserId().intValue(),
                    NotificationType.LIKE,
                    postId,
                    "Bài viết được thích",
                    "Ai đó đã thích bài viết của bạn",
                    likeRequest.getUserId().toString());
        }

        return toResponse(like);
    }

    // Bỏ thích bài viết
    @Transactional
    public void unlikePost(Integer postId, Integer userId) {
        likeRepository.deleteByPostIdAndUserId(postId, userId);
    }

    // Đếm số lượt like của bài viết
    public Integer countLikesByPostId(Integer postId) {
        return likeRepository.countByPostId(postId);
    }

    // Kiểm tra người dùng đã like bài viết chưa
    public boolean checkUserLiked(Integer postId, Integer userId) {
        return likeRepository.existsByPostIdAndUserId(postId, userId);
    }

    // Lấy tất cả like của bài viết
    public List<LikeResponse> getLikesByPostId(Integer postId) {
        List<Like> likes = likeRepository.findByPostId(postId);
        return likes.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Chuyển đổi Like entity thành LikeResponse
    private LikeResponse toResponse(Like like) {
        LikeResponse response = new LikeResponse();
        response.setLikeId(like.getLikeId());
        response.setPostId(like.getPostId());
        response.setUserId(like.getUserId());
        response.setCreatedAt(like.getCreatedAt());
        return response;
    }
}
