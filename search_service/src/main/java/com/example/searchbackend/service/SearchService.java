package com.example.searchbackend.service;

import com.example.searchbackend.model.RelationStatus;
import com.example.searchbackend.model.User;
import com.example.searchbackend.model.UserSearchDTO;
import com.example.searchbackend.repository.FriendRepository;
import com.example.searchbackend.repository.FriendRequestRepository;
import com.example.searchbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    // Hàm check quan hệ
    public RelationStatus getRelationStatus(Integer currentUserId, Integer otherUserId) {
        if (friendRepository.existsByUsers(currentUserId, otherUserId)) {
            return RelationStatus.FRIEND;
        } else if (friendRequestRepository.findBySenderIdAndReceiverId(currentUserId, otherUserId).isPresent()) {
            return RelationStatus.REQUEST_SENT;
        } else if (friendRequestRepository.findBySenderIdAndReceiverId(otherUserId, currentUserId).isPresent()) {
            return RelationStatus.REQUEST_RECEIVED;
        } else {
            return RelationStatus.NOT_FRIEND;
        }
    }
    public List<UserSearchDTO> searchUsersWithStatus(String query, Integer currentUserId) {
        List<User> matchedUsers = userRepository.searchUsers(query, currentUserId);

        return matchedUsers.stream().map(user -> {
            RelationStatus status = getRelationStatus(currentUserId, user.getId());
            return new UserSearchDTO(user, status);
        }).toList();
    }
}

