package com.example.friend_service.service;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.friend_service.Client.UserClient;
import com.example.friend_service.DTO.UserDTO;
import com.example.friend_service.Entity.FriendRequest;
import com.example.friend_service.Repository.FriendRepository;
import com.example.friend_service.Repository.FriendRequestRepository;

public class FriendSuggestService {
    
    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserClient userClient;

    
    public int calculateMutualFriends(Integer currentUserId, Integer targetUserId) {
        if (currentUserId == null || targetUserId == null) return 0;
        List<Integer> currentUserFriends = friendRepository.findFriendsByUserId(currentUserId)
                .stream()
                .map(friendship -> 
                    friendship.getUser1Id().equals(currentUserId) ? friendship.getUser2Id() : friendship.getUser1Id())
                .collect(Collectors.toList());
        List<Integer> targetUserFriends = friendRepository.findFriendsByUserId(targetUserId)
                .stream()
                .map(friendship -> 
                    friendship.getUser1Id().equals(targetUserId) ? friendship.getUser2Id() : friendship.getUser1Id())
                .collect(Collectors.toList());
        return (int) currentUserFriends.stream()
                .filter(targetUserFriends::contains)
                .count();
    }

   
    public List<UserDTO> getFriendSuggestions(Integer currentUserId) {
        if (currentUserId == null) return Collections.emptyList();
        List<Integer> friends = friendRepository.findFriendsByUserId(currentUserId)
                .stream()
                .map(friendship -> 
                    friendship.getUser1Id().equals(currentUserId) ? friendship.getUser2Id() : friendship.getUser1Id())
                .collect(Collectors.toList());
        Map<Integer, Integer> mutualFriends = new HashMap<>();
        Set<Integer> allPotentialFriends = new HashSet<>();
        for (Integer friendId : friends) {
            List<Integer> friendsOfFriend = friendRepository.findFriendsByUserId(friendId)
                    .stream()
                    .map(friendship -> 
                        friendship.getUser1Id().equals(friendId) ? friendship.getUser2Id() : friendship.getUser1Id())
                    .collect(Collectors.toList());
            allPotentialFriends.addAll(friendsOfFriend);
        }
        for (Integer potentialFriendId : allPotentialFriends) {
            if (!potentialFriendId.equals(currentUserId) && !friends.contains(potentialFriendId)) {
                int mutualCount = calculateMutualFriends(currentUserId, potentialFriendId);
                if (mutualCount > 0) {
                    mutualFriends.put(potentialFriendId, mutualCount);
                }
            }
        }
        List<Integer> pendingRequests = friendRequestRepository.findPendingRequests(currentUserId)
        .stream()
        .map(req -> {
            if (req == null  || currentUserId == null) return null;
            return Objects.equals(req.getSenderId(), currentUserId) ? req.getReceiverId() : req.getSenderId();
        })
        .filter(Objects::nonNull)
        .collect(Collectors.toList());
        return mutualFriends.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(10)
                .map(entry -> {
                    try {
                        UserDTO userDTO = userClient.getUserById(entry.getKey());
                        if (userDTO != null) {
                            userDTO.setMutualFriends(entry.getValue());
                        } else {
                            userDTO = new UserDTO();
                            userDTO.setId(entry.getKey());
                            userDTO.setMutualFriends(entry.getValue());
                        }
                        return userDTO;
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
