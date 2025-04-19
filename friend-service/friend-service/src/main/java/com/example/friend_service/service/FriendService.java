package com.example.friend_service.service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.example.friend_service.Repository.*;

import jakarta.transaction.Transactional;

import com.example.friend_service.Entity.*;
import com.example.friend_service.DTO.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class FriendService {
    @Autowired
    private FriendRepository friendRepository;

    
    @Autowired
    private RestTemplate restTemplate;

    private String getAuthToken(){
        ServletRequestAttributes attributes= (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null){
            String authHeader= attributes.getRequest().getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer")){
                return authHeader.substring(7);
            }
        }
        throw new IllegalStateException("No Authorization token found in request.");
    }

    private Integer getCurrentUserId() {
        String token = getAuthToken();
        String userServiceUrl = "https://30d3d25d-e531-436a-a0eb-8c0129d2c599.mock.pstmn.io/api/users/me";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        try {
            ResponseEntity<FriendDTO> response = restTemplate.exchange(
                    userServiceUrl,
                    HttpMethod.GET,
                    entity,
                    FriendDTO.class
            );
            FriendDTO currentUser = response.getBody();
            if (currentUser != null) {
                return currentUser.getId();
            }
            throw new IllegalStateException("Could not retrieve current user information.");
        } catch (Exception e) {
            throw new IllegalStateException("Error retrieving current user: " + e.getMessage());
        }
    }


    public List<FriendDTO> getAllFriends() {
        Integer user1Id = getCurrentUserId();
        List<Friend> friends = friendRepository.findByUser1Id(user1Id);
        Function<Friend, FriendDTO> toUserDTO = friend -> {
            String userServiceUrl = "https://30d3d25d-e531-436a-a0eb-8c0129d2c599.mock.pstmn.io/api/users/" + friend.getUser2Id() + "/basic";
            return restTemplate.getForObject(userServiceUrl, FriendDTO.class);
        };
        return friends.stream()
                .map(toUserDTO)
                .collect(Collectors.toList());
    }

    @Transactional(rollbackOn = Exception.class)
    public Friend addFriend(Integer user2Id) {
        try {
            Integer user1Id = getCurrentUserId();
            String user2Url = "https://30d3d25d-e531-436a-a0eb-8c0129d2c599.mock.pstmn.io/api/users/" + user2Id + "/basic";
            FriendDTO user2 = restTemplate.getForObject(user2Url, FriendDTO.class);
            if (user2 == null) {
                throw new IllegalArgumentException("User with ID " + user2Id + " does not exist.");
            }           
            boolean alreadyFriends = friendRepository.existsByUser1IdAndUser2Id(user1Id, user2Id) ||
                                    friendRepository.existsByUser1IdAndUser2Id(user2Id, user1Id);
            if (alreadyFriends) {
                throw new IllegalStateException("You are already friends with user " + user2Id + ".");
            }

            Friend friend1 = new Friend();
            friend1.setUser1Id(user1Id);
            friend1.setUser2Id(user2Id);
            friend1.setFriendshipDate(LocalDateTime.now());
            friendRepository.save(friend1);

            Friend friend2 = new Friend();
            friend2.setUser1Id(user2Id);
            friend2.setUser2Id(user1Id);
            friend2.setFriendshipDate(LocalDateTime.now());
            friendRepository.save(friend2);

            return friend1;
        } catch (DataAccessException e) {
            System.err.println("Database error while saving friend: " + e.getMessage());
            throw new RuntimeException("Database error: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("Unexpected error while saving friend: " + e.getMessage());
            throw new RuntimeException("Unexpected error: " + e.getMessage(), e);
        }
    }


    public void removeFriend(Integer user2Id) {
        Integer user1Id = getCurrentUserId();
        String user2Url = "https://30d3d25d-e531-436a-a0eb-8c0129d2c599.mock.pstmn.io/api/users/" + user2Id + "/basic";
        try {
            FriendDTO user2 = restTemplate.getForObject(user2Url, FriendDTO.class);
            if (user2 == null) {
                throw new IllegalArgumentException("User with ID " + user2Id + " does not exist.");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Error checking user existence: " + e.getMessage());
        }

        Friend friend1 = friendRepository.findByUser1IdAndUser2Id(user1Id, user2Id);
        Friend friend2 = friendRepository.findByUser1IdAndUser2Id(user2Id, user1Id);

        if (friend1 == null && friend2 == null) {
            throw new IllegalStateException("You are not friends with user " + user2Id + ".");
        }

        if (friend1 != null) {
            friendRepository.delete(friend1);
        }
        if (friend2 != null) {
            friendRepository.delete(friend2);
        }
    }

    
    // private int calculateMutualFriends(Integer userId, Integer friendId, Set<Integer> userFriends, Map<Integer, Set<Integer>> friendsOfFriendsMap) {
    //     Set<Integer> friendOfFriendIds = friendsOfFriendsMap.getOrDefault(friendId, new HashSet<>());
    //     Set<Integer> mutualFriends = new HashSet<>(friendOfFriendIds);
    //     mutualFriends.retainAll(userFriends);
    //     mutualFriends.remove(userId);
    //     mutualFriends.remove(friendId);

    //     return mutualFriends.size();
    // }

    // private Map<Integer, Set<Integer>> getFriendsOfFriendsMap(List<Integer> userIds) {
    //     if (userIds.isEmpty()) {
    //         return new HashMap<>();
    //     }
    //     List<Friend> friendsOfFriends = friendRepository.findByUser1IdIn(userIds);

    //     return friendsOfFriends.stream()
    //         .collect(Collectors.groupingBy(
    //             Friend::getUser1Id,
    //             Collectors.mapping(Friend::getUser2Id, Collectors.toSet())
    //         ));
    // }
    
}
