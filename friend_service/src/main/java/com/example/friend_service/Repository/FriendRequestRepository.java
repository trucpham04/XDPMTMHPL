package com.example.friend_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.friend_service.Entity.Friend;
import com.example.friend_service.Entity.FriendRequest;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {
    List<FriendRequest> findByReceiverId(Integer receiverId);
    List<FriendRequest> findBySenderId(Integer senderId);
    boolean existsBySenderIdAndReceiverId(Integer senderId, Integer receiverId);
    FriendRequest findBySenderIdAndReceiverId(Integer senderId, Integer receiverId);


}
