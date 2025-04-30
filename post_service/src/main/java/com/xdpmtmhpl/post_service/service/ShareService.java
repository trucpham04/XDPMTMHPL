package com.xdpmtmhpl.post_service.service;

import com.xdpmtmhpl.post_service.model.SharedPost;
import com.xdpmtmhpl.post_service.repository.SharedPostRepository;
import com.xdpmtmhpl.post_service.response.ShareResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShareService {

    @Autowired
    private SharedPostRepository sharedPostRepository;

    public ShareResponse sharePost(Integer postId, Integer userId, String content, String viewer) {
        try {
            SharedPost share = new SharedPost();
            share.setOriginalPostId(postId);
            share.setUserId(userId);
            share.setContent(content);
            share.setViewer(viewer);
            share.setCreatedAt(LocalDateTime.now());

            SharedPost saved = sharedPostRepository.save(share);
            return toResponse(saved);
        } catch (Exception e) {
            throw new RuntimeException("Failed to share post: " + e.getMessage());
        }
    }

    public void deleteShare(Integer sharedPostId) {
        try {
            sharedPostRepository.deleteById(sharedPostId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete share: " + e.getMessage());
        }
    }

    public List<ShareResponse> getSharesByPostId(Integer postId) {
        try {
            List<SharedPost> shares = sharedPostRepository.findByOriginalPostId(postId);
            return shares.stream().map(this::toResponse).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get shares: " + e.getMessage());
        }
    }


    public List<ShareResponse> getSharesByUserId(Integer userId) {
        List<SharedPost> sharedPosts = sharedPostRepository.findByUserId(userId);
        return sharedPosts.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    private ShareResponse toResponse(SharedPost share) {
        ShareResponse res = new ShareResponse();
        res.setSharedPostId(share.getSharedPostId());
        res.setOriginalPostId(share.getOriginalPostId());
        res.setUserId(share.getUserId());
        res.setContent(share.getContent());
        res.setViewer(share.getViewer());
        res.setCreatedAt(share.getCreatedAt());
        return res;
    }
}
