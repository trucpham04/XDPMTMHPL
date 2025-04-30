package com.xdpmtmhpl.post_service.service;

import com.xdpmtmhpl.post_service.model.Like;
import com.xdpmtmhpl.post_service.response.LikeResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LikeService {

    @Autowired
    private RestTemplate restTemplate;

    private static final String BASE_URL = "http://localhost:8083";

    public LikeResponse likePost(Integer postId, Integer userId) {
        try {
            Like like = new Like();
            like.setPostId(postId);
            like.setUserId(userId);

            Like createdLike = restTemplate.postForObject(
                    BASE_URL + "/api/posts/" + postId + "/likes", like, Like.class
            );
            return toResponse(createdLike);
        } catch (Exception e) {
            throw new RuntimeException("Không thể like bài viết: " + e.getMessage(), e);
        }
    }

    public void unlikePost(Integer postId, Integer userId) {
        try {
            restTemplate.delete(BASE_URL + "/api/posts/" + postId + "/likes?userId=" + userId);
        } catch (Exception e) {
            throw new RuntimeException("Không thể bỏ like bài viết: " + e.getMessage(), e);
        }
    }

    public Long countLikesByPostId(Integer postId) {
        try {
            return restTemplate.getForObject(
                    BASE_URL + "/api/posts/" + postId + "/likes/count", Long.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Không thể đếm số lượt like: " + e.getMessage(), e);
        }
    }

    public boolean checkUserLiked(Integer postId, Integer userId) {
        try {
            return restTemplate.getForObject(
                    BASE_URL + "/api/posts/" + postId + "/likes/check?userId=" + userId, Boolean.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Không thể kiểm tra like của người dùng: " + e.getMessage(), e);
        }
    }

    public List<LikeResponse> getLikesByPostId(Integer postId) {
        try {
            Like[] likes = restTemplate.getForObject(
                    BASE_URL + "/api/posts/" + postId + "/likes", Like[].class
            );
            if (likes == null) return List.of();

            return Arrays.stream(likes)
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Không thể lấy danh sách lượt like: " + e.getMessage(), e);
        }
    }

    private LikeResponse toResponse(Like like) {
        if (like == null) return null;
        LikeResponse response = new LikeResponse();
        response.setLikeId(like.getLikeId());
        response.setPostId(like.getPostId());
        response.setUserId(like.getUserId());
        response.setCreatedAt(like.getCreatedAt());
        return response;
    }
}
