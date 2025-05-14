package com.example.friend_service.service;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.example.friend_service.Repository.FriendRepository;
import com.example.friend_service.Repository.FriendRequestRepository;
import com.example.friend_service.Entity.Friend;
import com.example.friend_service.Client.UserClient;
import com.example.friend_service.DTO.UserDTO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

@Service
public class FriendService {

    @Autowired
    private FriendRepository friendRepository;
    @Autowired
    private FriendRequestRepository friendRequestRepository;
    @Autowired
    private UserClient userClient;

    private String getAuthToken() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            if (request.getCookies() != null) {
                for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                    if ("jwt".equals(cookie.getName())) {
                        return cookie.getValue();
                    }
                }
            }
        }
        throw new IllegalStateException("No JWT token found in cookie.");
    }

    private Integer getCurrentUserId() {
        String token = getAuthToken();
        try {
            UserDTO currentUser = userClient.getUserByToken(token);
            if (currentUser != null) {
                return currentUser.getId();
            }
            throw new IllegalStateException("Could not retrieve current user information.");
        } catch (Exception e) {
            throw new IllegalStateException("Error retrieving current user: " + e.getMessage());
        }
    }

    public List<UserDTO> getAllFriends() {
        Integer user1Id = getCurrentUserId();
        List<Friend> friends = friendRepository.findByUser1Id(user1Id);
        Function<Friend, UserDTO> toUserDTO = friend -> {
            UserDTO user2 = userClient.getUserById(friend.getUser2Id());
            return user2;
        };
        return friends.stream()
                .map(toUserDTO)
                .collect(Collectors.toList());
    }

    @Transactional(rollbackOn = Exception.class)
    public Friend addFriend(Integer user2Id) {
        try {
            Integer user1Id = getCurrentUserId();
            UserDTO user2 = userClient.getUserById(user2Id);
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
        try {
            UserDTO user2 = userClient.getUserById(user2Id);
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

    public boolean checkFriendShip(Integer user2Id) {
        Integer user1Id = getCurrentUserId();
        boolean alreadyFriends = friendRepository.existsByUser1IdAndUser2Id(user1Id, user2Id) ||
                friendRepository.existsByUser1IdAndUser2Id(user2Id, user1Id);
        System.out.println("hello");
        return alreadyFriends;
    }

    public Map<String, Boolean> getFriendStatus(Integer otherUserId) {
        Integer currentUserId = getCurrentUserId();
        Map<String, Boolean> status = new HashMap<>();
        status.put("isFriend", friendRepository.existsByUser1IdAndUser2Id(currentUserId, otherUserId));
        status.put("isFriendRequestSent",
                friendRequestRepository.existsBySenderIdAndReceiverId(currentUserId, otherUserId));
        status.put("isFriendRequestReceived",
                friendRequestRepository.existsBySenderIdAndReceiverId(otherUserId, currentUserId));
        return status;
    }

    public List<UserDTO> getUserFriends(Integer userId) {
        List<Friend> friendsAsUser1 = friendRepository.findByUser1Id(userId);

        List<UserDTO> friends = friendsAsUser1.stream()
                .map(friend -> userClient.getUserById(friend.getUser2Id()))
                .collect(Collectors.toList());

        return friends;
    }

    // private int calculateMutualFriends(Integer userId, Integer friendId,
    // Set<Integer> userFriends, Map<Integer, Set<Integer>> friendsOfFriendsMap) {
    // Set<Integer> friendOfFriendIds = friendsOfFriendsMap.getOrDefault(friendId,
    // new HashSet<>());
    // Set<Integer> mutualFriends = new HashSet<>(friendOfFriendIds);
    // mutualFriends.retainAll(userFriends);
    // mutualFriends.remove(userId);
    // mutualFriends.remove(friendId);

    // return mutualFriends.size();
    // }

    // private Map<Integer, Set<Integer>> getFriendsOfFriendsMap(List<Integer>
    // userIds) {
    // if (userIds.isEmpty()) {
    // return new HashMap<>();
    // }
    // List<Friend> friendsOfFriends = friendRepository.findByUser1IdIn(userIds);

    // return friendsOfFriends.stream()
    // .collect(Collectors.groupingBy(
    // Friend::getUser1Id,
    // Collectors.mapping(Friend::getUser2Id, Collectors.toSet())
    // ));
    // }
}

// private int calculateMutualFriends(Integer userId, Integer friendId,
// Set<Integer> userFriends, Map<Integer, Set<Integer>> friendsOfFriendsMap) {
// Set<Integer> friendOfFriendIds = friendsOfFriendsMap.getOrDefault(friendId,
// new HashSet<>());
// Set<Integer> mutualFriends = new HashSet<>(friendOfFriendIds);
// mutualFriends.retainAll(userFriends);
// mutualFriends.remove(userId);
// mutualFriends.remove(friendId);

// return mutualFriends.size();
// }

// private Map<Integer, Set<Integer>> getFriendsOfFriendsMap(List<Integer>
// userIds) {
// if (userIds.isEmpty()) {
// return new HashMap<>();
// }
// List<Friend> friendsOfFriends = friendRepository.findByUser1IdIn(userIds);

// return friendsOfFriends.stream()
// .collect(Collectors.groupingBy(
// Friend::getUser1Id,
// Collectors.mapping(Friend::getUser2Id, Collectors.toSet())
// ));
// }
