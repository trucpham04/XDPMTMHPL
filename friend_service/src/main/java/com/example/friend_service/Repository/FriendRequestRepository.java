package com.example.friend_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.friend_service.Entity.Friend;
import com.example.friend_service.Entity.FriendRequest;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {
    List<FriendRequest> findByReceiverId(Integer receiverId);
    List<FriendRequest> findBySenderId(Integer senderId);
    boolean existsBySenderIdAndReceiverId(Integer senderId, Integer receiverId);
    FriendRequest findBySenderIdAndReceiverId(Integer senderId, Integer receiverId);

    @Query("SELECT fr FROM friends_request fr WHERE fr.senderId = :userId OR fr.receiverId = :userId")
    List<FriendRequest> findPendingRequests(@Param("userId") Integer userId);
}
