package com.xdpmtmhpl.post_service.controller;

import com.xdpmtmhpl.post_service.request.ShareRequest;
import com.xdpmtmhpl.post_service.response.ShareResponse;
import com.xdpmtmhpl.post_service.service.ShareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/shares")
public class SharedPostController {

    @Autowired
    private ShareService shareService;

    @PostMapping
    public ResponseEntity<ShareResponse> sharePost(
            @PathVariable Integer postId,
            @RequestBody ShareRequest request
    ) {
        ShareResponse response = shareService.sharePost(postId, request.getUserId(), request.getContent(), request.getViewer());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ShareResponse>> getShares(@PathVariable Integer postId) {
        List<ShareResponse> shares = shareService.getSharesByPostId(postId);
        return ResponseEntity.ok(shares);
    }

    @GetMapping("/user/{userId}")
    public List<ShareResponse> getSharesByUser(@PathVariable Integer userId) {
        return shareService.getSharesByUserId(userId);
    }


    @DeleteMapping("/{sharedPostId}")
    public ResponseEntity<Void> deleteShare(@PathVariable Integer sharedPostId) {
        shareService.deleteShare(sharedPostId);
        return ResponseEntity.noContent().build();
    }
}
