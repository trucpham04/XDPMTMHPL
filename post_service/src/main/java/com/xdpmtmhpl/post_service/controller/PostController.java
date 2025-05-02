// package com.xdpmtmhpl.post_service.controller;

// import com.xdpmtmhpl.post_service.models.Post;
// import com.xdpmtmhpl.post_service.repository.PostRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/posts")
// public class PostController {

//     @Autowired
//     private PostRepository postRepository;

//     @GetMapping
//     public List<Post> getAllPosts() {
//         return postRepository.findAll();
//     }

//     @PostMapping
//     public Post createPost(@RequestBody Post post) {
//         return postRepository.save(post);
//     }
// }
package com.xdpmtmhpl.post_service.controller;

import com.xdpmtmhpl.post_service.dto.CommentDTO;
import com.xdpmtmhpl.post_service.dto.LikeDTO;
import com.xdpmtmhpl.post_service.services.CommentService;
import com.xdpmtmhpl.post_service.services.LikeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private LikeService likeService;

    // Comment APIs
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<Page<CommentDTO>> getComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CommentDTO> comments = commentService.getCommentsByPostId(postId, PageRequest.of(page, size));
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentDTO commentDTO) {
        CommentDTO createdComment = commentService.createComment(postId, commentDTO);
        return ResponseEntity.ok(createdComment);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentDTO commentDTO) {
        CommentDTO updatedComment = commentService.updateComment(commentId, commentDTO);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestParam Long userId) {
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    // Like APIs
    @GetMapping("/posts/{postId}/likes")
    public ResponseEntity<List<LikeDTO>> getLikes(@PathVariable Long postId) {
        List<LikeDTO> likes = likeService.getLikesByPostId(postId);
        return ResponseEntity.ok(likes);
    }

    @PostMapping("/posts/{postId}/likes")
    public ResponseEntity<Void> likePost(
            @PathVariable Long postId,
            @RequestBody Long userId) {
        likeService.likePost(postId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/posts/{postId}/likes/{userId}")
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long postId,
            @PathVariable Long userId) {
        likeService.unlikePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Integer postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    // Chuyển đổi từ Entity sang DTO
    private PostResponse toResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setPostId(post.getPostId());
        response.setUserId(post.getUserId());
        response.setContent(post.getContent());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        response.setViewer(post.getViewer());
        response.setMultiFile(post.getMultiFile());
        return response;
    }
}
