package com.xdpmtmhpl.post_service.controller;

import com.xdpmtmhpl.post_service.Client.UserClient;
import com.xdpmtmhpl.post_service.DTO.UserDTO;
import com.xdpmtmhpl.post_service.model.Post;
import com.xdpmtmhpl.post_service.model.SharedPost;
import com.xdpmtmhpl.post_service.repository.CommentRepository;
import com.xdpmtmhpl.post_service.repository.LikeRepository;
import com.xdpmtmhpl.post_service.repository.SharedPostRepository;
import com.xdpmtmhpl.post_service.request.PostRequest;
import com.xdpmtmhpl.post_service.response.PostResponse;
import com.xdpmtmhpl.post_service.response.ShareResponse;
import com.xdpmtmhpl.post_service.service.GetUser;
import com.xdpmtmhpl.post_service.service.PostService;
import com.xdpmtmhpl.post_service.service.ShareService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private ShareService shareService;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private SharedPostRepository sharedPostRepository;

    @Autowired
    private UserClient userClient;

    @Autowired
    private GetUser getUser;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostRequest postRequest) {
        UserDTO user = userClient.getUserById(postRequest.getUserId());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Post post = new Post();
        post.setUserId(postRequest.getUserId());
        post.setContent(postRequest.getContent());
        post.setCreatedAt(postRequest.getCreatedAt());
        post.setUpdatedAt(postRequest.getUpdatedAt());
        post.setViewer(postRequest.getViewer());
        post.setMultiFile(postRequest.getMultiFile());
        Post createdPost = postService.createPost(post);
        return ResponseEntity.ok(toResponse(createdPost));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Integer postId) {
        Post post = postService.getPostById(postId);

        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(toResponse(post));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getPostsByUserId(@PathVariable Integer userId) {
        List<Post> posts = postService.getPostsByUserId(userId);
        List<PostResponse> responseList = posts.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Integer postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/shares/user/{userId}")
    public ResponseEntity<List<ShareResponse>> getSharesByUser(@PathVariable Integer userId) {
        List<SharedPost> shares = shareService.getSharesByUserId(userId);

        List<ShareResponse> responseList = shares.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/search")
    public ResponseEntity<List<PostResponse>> searchPosts(@RequestParam String keyword) {
        List<Post> posts = postService.searchPosts(keyword);
        List<PostResponse> responseList = posts.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Integer postId, @RequestBody PostRequest postRequest) {
        Post updatedPost = new Post();
        updatedPost.setContent(postRequest.getContent());
        updatedPost.setUpdatedAt(postRequest.getUpdatedAt());
        updatedPost.setViewer(postRequest.getViewer());
        updatedPost.setMultiFile(postRequest.getMultiFile());

        Post post = postService.updatePost(postId, updatedPost);
        return ResponseEntity.ok(toResponse(post));
    }

    public PostResponse toResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setPostId(post.getPostId());
        response.setUserId(post.getUserId());
        response.setContent(post.getContent());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        response.setViewer(post.getViewer());
        response.setMultiFile(post.getMultiFile());

        response.setLikes(likeRepository.countByPostId(post.getPostId()));
        response.setComments(commentRepository.countByPost_PostId(post.getPostId()));
        response.setShares(sharedPostRepository.countByOriginalPostId(post.getPostId()));
        response.setAuthor(userClient.getUserById(post.getUserId()));
        Integer currentUser = getUser.getCurrentUserId();

        if (currentUser != null) {
            response.setIsLiked(likeRepository.existsByPostIdAndUserId(post.getPostId(), currentUser));
        } else {
            response.setIsLiked(false);
        }

        return response;
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPostsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {

        Page<Post> postPage = postService.getPostsWithPagination(page, size);

        Page<PostResponse> responsePage = postPage.map(this::toResponse);

        return ResponseEntity.ok(responsePage);
    }

    public ShareResponse toResponse(SharedPost share) {
        ShareResponse res = new ShareResponse();
        res.setSharedPostId(share.getSharedPostId());
        res.setOriginalPostId(share.getOriginalPostId());
        res.setUserId(share.getUserId());
        res.setContent(share.getContent());
        res.setViewer(share.getViewer());
        res.setCreatedAt(share.getCreatedAt());
        res.setOriginalPost(toResponse(postService.getPostById(share.getOriginalPostId())));
        UserDTO author = userClient.getUserById(share.getUserId());
        if (author.getId() == null) {
            throw new RuntimeException("User not found with ID: " + share.getUserId());
        }
        res.setAuthor(author);
        return res;
    }

}
