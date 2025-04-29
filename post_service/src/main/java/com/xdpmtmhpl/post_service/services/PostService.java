package com.xdpmtmhpl.post_service.services;

import com.xdpmtmhpl.post_service.models.Post;
import com.xdpmtmhpl.post_service.models.User;
import com.xdpmtmhpl.post_service.payload.request.PostRequest;
import com.xdpmtmhpl.post_service.repository.PostRepository;
import com.xdpmtmhpl.post_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // Lấy tất cả bài đăng
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Lấy bài đăng theo ID
    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    // Lấy danh sách bài đăng của một user
    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    // Tạo bài đăng mới
    public Post createPost(PostRequest postRequest, Long userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Post post = new Post();
        post.setContent(postRequest.getContent());
        post.setUser(user);

        // Xử lý upload danh sách hình ảnh nếu có
        List<MultipartFile> images = postRequest.getImages();
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String imageUrl = saveImage(image);
                    imageUrls.add(imageUrl);
                }
            }
            post.setImageUrls(imageUrls);
        }

        return postRepository.save(post);
    }

    // Phương thức lưu hình ảnh vào server
    private String saveImage(MultipartFile image) throws IOException {
        String uploadDir = "uploads/posts/";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        File dest = new File(uploadDir + fileName);
        image.transferTo(dest);
        return uploadDir + fileName;
    }

    // Xóa bài đăng
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Post not found with id: " + id);
        }
        postRepository.deleteById(id);
    }
}