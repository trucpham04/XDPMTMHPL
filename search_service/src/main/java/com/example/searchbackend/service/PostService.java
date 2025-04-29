package com.example.searchbackend.service;

import com.example.searchbackend.model.Post;
import com.example.searchbackend.model.PostResponseDTO;
import com.example.searchbackend.model.User;
import com.example.searchbackend.repository.PostRepository;
import com.example.searchbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PostResponseDTO> searchPosts(String query) {
        // 1. Lấy bài viết chứa nội dung phù hợp
        List<Post> contentMatchedPosts = postRepository.findByContentContainingIgnoreCase(query);

        // 2. Tìm user có tên gần đúng
        List<User> matchedUsers = userRepository.searchFlexible( query);
        Set<Integer> userIds = matchedUsers.stream().map(User::getId).collect(Collectors.toSet());

        // 3. Lấy bài viết từ các user tìm được
        List<Post> authorMatchedPosts = postRepository.findAllByUserIdIn(userIds);

        // 4. Gộp và loại bỏ trùng lặp
        Set<Post> allMatchedPosts = new HashSet<>();
        allMatchedPosts.addAll(contentMatchedPosts);
        allMatchedPosts.addAll(authorMatchedPosts);
        System.out.println("🔍 Đang tìm kiếm với query: " + query);
        // 5. Convert sang DTO
        return allMatchedPosts.stream().map(post -> {
                    PostResponseDTO dto = new PostResponseDTO();
                    dto.setId(post.getId());
                    dto.setContent(post.getContent());
                    dto.setPrivacyLevel(post.getPrivacyLevel());
                    dto.setStatus(post.getStatus());
                    dto.setCreatedAt(post.getCreatedAt());
                    dto.setUpdatedAt(post.getUpdatedAt());

                    User user = userRepository.findById(post.getUserId()).orElse(null);
                    if (user != null) {
                        PostResponseDTO.AuthorDTO author = new PostResponseDTO.AuthorDTO(
                                user.getId(),
                                user.getFirstName(),
                                user.getLastName(),
                                user.getAvatarUrl()
                        );
                        dto.setAuthor(author);
                    }

                    return dto;
                }).sorted(Comparator.comparing(PostResponseDTO::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }
}
