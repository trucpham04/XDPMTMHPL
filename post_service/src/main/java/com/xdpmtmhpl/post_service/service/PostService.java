package com.xdpmtmhpl.post_service.service;

import com.xdpmtmhpl.post_service.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;

import java.util.Collections;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private RestTemplate restTemplate;

    private static final String BASE_URL = "http://localhost:8083";

    public Post createPost(Post post) {
        try {
            return restTemplate.postForObject(BASE_URL + "/api/posts", post, Post.class);
        } catch (RestClientException e) {
            throw new RuntimeException("Lỗi khi tạo bài viết: " + e.getMessage(), e);
        }
    }

    public Post getPostById(Integer postId) {
        try {
            return restTemplate.getForObject(BASE_URL + "/api/posts/" + postId, Post.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new RuntimeException("Không tìm thấy bài viết với ID: " + postId);
        } catch (RestClientException e) {
            throw new RuntimeException("Lỗi khi lấy bài viết: " + e.getMessage(), e);
        }
    }

    public List<Post> getPostsByUserId(Integer userId) {
        try {
            ResponseEntity<List> response = restTemplate.getForEntity(BASE_URL + "/api/posts/user/" + userId, List.class);
            return response.getBody();
        } catch (RestClientException e) {
            throw new RuntimeException("Lỗi khi lấy danh sách bài viết theo userId: " + e.getMessage(), e);
        }
    }

    public void deletePost(Integer postId) {
        try {
            restTemplate.delete(BASE_URL + "/api/posts/" + postId);
        } catch (HttpClientErrorException.NotFound e) {
            throw new RuntimeException("Không tìm thấy bài viết để xóa với ID: " + postId);
        } catch (RestClientException e) {
            throw new RuntimeException("Lỗi khi xóa bài viết: " + e.getMessage(), e);
        }
    }
}
