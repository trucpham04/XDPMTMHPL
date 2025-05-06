package com.xdpmtmhpl.post_service.controller;

import com.xdpmtmhpl.post_service.Client.UserClient;
import com.xdpmtmhpl.post_service.DTO.UserDTO;
import com.xdpmtmhpl.post_service.model.SharedPost;
import com.xdpmtmhpl.post_service.request.ShareRequest;
import com.xdpmtmhpl.post_service.response.ShareResponse;
import com.xdpmtmhpl.post_service.service.PostService;
import com.xdpmtmhpl.post_service.service.ShareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts/{postId}/shares")
public class SharedPostController {

    @Autowired
    private ShareService shareService;

    @Autowired
    private PostController postController;

    @Autowired
    private PostService postService;

    @Autowired
    private UserClient userClient;

    @PostMapping
    public ResponseEntity<ShareResponse> sharePost(
            @PathVariable Integer postId,
            @RequestBody ShareRequest request) {
        SharedPost response = shareService.sharePost(postId, request);
        return ResponseEntity.ok(toResponse(response));
    }

    @GetMapping
    public ResponseEntity<List<ShareResponse>> getShares(@PathVariable Integer postId) {
        List<SharedPost> shares = shareService.getSharesByPostId(postId);
        List<ShareResponse> responseList = shares.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @DeleteMapping("/{sharedPostId}")
    public ResponseEntity<Void> deleteShare(@PathVariable Integer sharedPostId) {
        shareService.deleteShare(sharedPostId);
        return ResponseEntity.noContent().build();
    }

    public ShareResponse toResponse(SharedPost share) {
        ShareResponse res = new ShareResponse();
        res.setSharedPostId(share.getSharedPostId());
        res.setOriginalPostId(share.getOriginalPostId());
        res.setUserId(share.getUserId());
        res.setContent(share.getContent());
        res.setViewer(share.getViewer());
        res.setCreatedAt(share.getCreatedAt());
        res.setOriginalPost(postController.toResponse(postService.getPostById(share.getOriginalPostId())));
        UserDTO author = userClient.getUserById(share.getUserId());
        if (author.getId() == null) {
            throw new RuntimeException("User not found with ID: " + share.getUserId());
        }
        res.setAuthor(author);
        return res;
    }
}
