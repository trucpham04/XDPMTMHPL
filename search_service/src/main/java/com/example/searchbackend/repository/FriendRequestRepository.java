package com.example.searchbackend.repository;

import com.example.searchbackend.model.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {
    Optional<FriendRequest> findBySenderIdAndReceiverId(Integer senderId, Integer receiverId);
    Optional<FriendRequest> findByReceiverIdAndSenderId(Integer receiverId, Integer senderId);
}
