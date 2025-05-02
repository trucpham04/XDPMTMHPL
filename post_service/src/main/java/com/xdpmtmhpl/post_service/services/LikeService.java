package com.xdpmtmhpl.post_service.services;

import com.xdpmtmhpl.post_service.client.UserServiceClient;
import com.xdpmtmhpl.post_service.dto.LikeDTO;
import com.xdpmtmhpl.post_service.dto.UserDTO;
import com.xdpmtmhpl.post_service.models.Like;
import com.xdpmtmhpl.post_service.models.Post;
import com.xdpmtmhpl.post_service.repository.LikeRepository;
import com.xdpmtmhpl.post_service.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserServiceClient userServiceClient;

    public List<LikeDTO> getLikesByPostId(Long postId) {
        List<Like> likes = likeRepository.findByPostId(postId);
        return likes.stream().map(like -> {
            UserDTO user = userServiceClient.getUserById(like.getUserId());
            LikeDTO dto = new LikeDTO();
            dto.setId(like.getId());
            dto.setPostId(like.getPost().getId());
            dto.setUserId(like.getUserId());
            dto.setUsername(user.getUsername());
            dto.setCreatedAt(like.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void likePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));

        UserDTO user = userServiceClient.getUserById(userId);
        if (user == null) {
            throw new EntityNotFoundException("User not found with id: " + userId);
        }

        if (likeRepository.findByPostIdAndUserId(postId, userId).isPresent()) {
            return; // Đã thích, không làm gì
        }

        Like like = new Like();
        like.setPost(post);
        like.setUserId(userId);
        likeRepository.save(like);
    }

    @Transactional
    public void unlikePost(Long postId, Long userId) {
        Like like = likeRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Like not found for postId: " + postId + " and userId: " + userId));

        likeRepository.delete(like);
    }
}