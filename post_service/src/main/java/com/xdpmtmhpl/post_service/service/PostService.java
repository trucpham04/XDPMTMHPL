package com.xdpmtmhpl.post_service.service;

import com.xdpmtmhpl.post_service.model.Post;
import com.xdpmtmhpl.post_service.repository.CommentRepository;
import com.xdpmtmhpl.post_service.repository.LikeRepository;
import com.xdpmtmhpl.post_service.repository.PostRepository;
import com.xdpmtmhpl.post_service.repository.SharedPostRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

}
