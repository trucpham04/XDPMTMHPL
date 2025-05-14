package com.xdpmtmhpl.post_service.service;

import com.xdpmtmhpl.post_service.model.Post;
import com.xdpmtmhpl.post_service.model.MultiFile;
import com.xdpmtmhpl.post_service.response.MediaResponse;
import com.xdpmtmhpl.post_service.repository.CommentRepository;
import com.xdpmtmhpl.post_service.repository.LikeRepository;
import com.xdpmtmhpl.post_service.repository.PostRepository;
import com.xdpmtmhpl.post_service.repository.SharedPostRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private SharedPostRepository sharedPostRepository;

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post getPostById(Integer postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với ID: " + postId));
    }

    public List<Post> getPostsByUserId(Integer userId) {
        return postRepository.findByUserId(userId);
    }

    @Transactional
    public void deletePost(Integer postId) {
        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Không tìm thấy bài viết để xóa với ID: " + postId);
        }
        likeRepository.deleteByPostId(postId);
        commentRepository.deleteByPost_PostId(postId);
        sharedPostRepository.deleteByOriginalPostId(postId);
        postRepository.deleteById(postId);
    }

    public List<Post> searchPosts(String keyword) {
        return postRepository.findByContentContainingIgnoreCase(keyword);
    }

    public Page<Post> getPostsWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findAll(pageable);

        return postPage;
    }

    @Transactional
    public Post updatePost(Integer postId, Post updatedPost) {
        Post existingPost = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với ID: " + postId));

        existingPost.setContent(updatedPost.getContent());
        existingPost.setUpdatedAt(updatedPost.getUpdatedAt());
        existingPost.setViewer(updatedPost.getViewer());
        existingPost.setMultiFile(updatedPost.getMultiFile());

        return postRepository.save(existingPost);
    }

    public List<Post> getAllPostsWithImagesByUserId(Long userId) {
        return postRepository.findAllPostsWithImagesByUserId(userId);
    }

    public List<Post> getAllPostsWithVideosByUserId(Long userId) {
        return postRepository.findAllPostsWithVideosByUserId(userId);
    }

    public List<MediaResponse> getAllImagesByUserId(Long userId) {
        List<Post> posts = postRepository.findAllPostsWithImagesByUserId(userId);
        return posts.stream()
                .flatMap(post -> post.getMultiFile().stream()
                        .filter(file -> file.getType().equals("image"))
                        .map(file -> MediaResponse.fromMultiFile(file, post.getPostId())))
                .collect(Collectors.toList());
    }

    public List<MediaResponse> getAllVideosByUserId(Long userId) {
        List<Post> posts = postRepository.findAllPostsWithVideosByUserId(userId);
        return posts.stream()
                .flatMap(post -> post.getMultiFile().stream()
                        .filter(file -> file.getType().equals("video"))
                        .map(file -> MediaResponse.fromMultiFile(file, post.getPostId())))
                .collect(Collectors.toList());
    }

}
