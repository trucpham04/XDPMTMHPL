package com.xdpmtmhpl.post_service.service;

import com.xdpmtmhpl.post_service.model.SharedPost;
import com.xdpmtmhpl.post_service.repository.SharedPostRepository;
import com.xdpmtmhpl.post_service.request.ShareRequest;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShareService {

    @Autowired
    private SharedPostRepository sharedPostRepository;

    public SharedPost sharePost(Integer postId, ShareRequest request) {
        SharedPost share = new SharedPost();
        share.setOriginalPostId(postId);
        share.setUserId(request.getUserId());
        share.setContent(request.getContent());
        share.setViewer(request.getViewer());
        share.setCreatedAt(LocalDateTime.now());

        SharedPost saved = sharedPostRepository.save(share);
        return saved;
    }

    @Transactional
    public void deleteShare(Integer sharedPostId) {
        sharedPostRepository.deleteBySharedPostId(sharedPostId);
    }

    public List<SharedPost> getSharesByPostId(Integer postId) {
        return sharedPostRepository.findByOriginalPostId(postId);
    }

    public List<SharedPost> getSharesByUserId(Integer userId) {
        return sharedPostRepository.findByUserId(userId);
    }

}
