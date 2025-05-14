package com.example.friend_service.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.example.friend_service.Client.MessageClient;
import com.example.friend_service.Client.UserClient;
import com.example.friend_service.DTO.UserDTO;
import com.example.friend_service.DTO.UserDTO;
import com.example.friend_service.Entity.FriendRequest;
import com.example.friend_service.Repository.FriendRepository;
import com.example.friend_service.Repository.FriendRequestRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class FriendRequestService {

    private static final Logger logger = (Logger) LoggerFactory.getLogger(FriendRequestService.class);
    
    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private FriendService friendService;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserClient userClient;

    @Autowired
    private MessageClient messageClient;

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


    public List<UserDTO> getAllFriendRequests() {
        logger.info("Hellooooo");
        Integer receiverId = getCurrentUserId();
        List<FriendRequest> friends = friendRequestRepository.findByReceiverId(receiverId);
        Function<FriendRequest, UserDTO> toUserDTO = friendRequest -> {
            // String userServiceUrl = "http://api-gateway:8090/api/auth/users/" +
            // friendRequest.getSenderId();
            // return restTemplate.getForObject(userServiceUrl, UserDTO.class);
            UserDTO userDTO = userClient.getUserById(friendRequest.getSenderId());
            System.out.println("Thời gian gửi request 1: "+ friendRequest.getTime());
            userDTO.setRequestTime(friendRequest.getTime());
            userDTO.setMutualFriends(calculateMutualFriends(receiverId, friendRequest.getSenderId()));
            System.out.println("Thời gian gửi request: "+ userDTO.getRequestTime());
            return userDTO;
        };
        return friends.stream()
                .map(toUserDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllRequestSent() {
        Integer senderId = getCurrentUserId();
        List<FriendRequest> friends = friendRequestRepository.findBySenderId(senderId);
        Function<FriendRequest, UserDTO> toUserDTO = friendRequest -> {

            // String userServiceUrl = "http://api-gateway:8090/api/auth/users/" +
            // friendRequest.getReceiverId();
            // return restTemplate.getForObject(userServiceUrl, UserDTO.class);
            UserDTO userDTO = userClient.getUserById(friendRequest.getReceiverId());
            return userDTO;
        };
        return friends.stream()
                .map(toUserDTO)
                .collect(Collectors.toList());
    }

    @Transactional(rollbackOn = Exception.class)
    public void acceptFriendRequest(Integer senderId) {
        try {
            Integer userId = getCurrentUserId();
            FriendRequest friendRequest = friendRequestRepository.findBySenderIdAndReceiverId(senderId, userId);

            if (friendRequest == null) {
                throw new IllegalArgumentException("Friend request not found");
            }
            friendService.addFriend(senderId);
            removeRequest(senderId);
            messageClient.createConversation(senderId, userId);
        } catch (DataAccessException e) {
            System.err.println("Database error while saving friend: " + e.getMessage());
            throw new RuntimeException("Database error: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("Unexpected error while saving friend: " + e.getMessage());
            throw new RuntimeException("Unexpected error: " + e.getMessage(), e);
        }
    }

    public FriendRequest SendRequest(Integer receiverId) {
        try {

            Integer senderId = getCurrentUserId();
            System.out.println(senderId);
            UserDTO receiver = userClient.getUserById(receiverId);
            if (receiver == null) {
                throw new IllegalArgumentException("User with ID " + receiverId + " does not exist.");
            }
            boolean alreadyFriendRequest = friendRequestRepository.existsBySenderIdAndReceiverId(senderId, receiverId);
            if (alreadyFriendRequest) {
                throw new IllegalStateException("You are request friends with user " + receiverId + ".");
            }

            FriendRequest friendRequest = new FriendRequest();
            friendRequest.setSenderId(senderId);
            friendRequest.setReceiverId(receiverId);
            friendRequest.setTime(LocalDateTime.now());
            friendRequestRepository.save(friendRequest);

            return friendRequest;
        } catch (DataAccessException e) {
            System.err.println("Database error while saving friend: " + e.getMessage());
            throw new RuntimeException("Database error: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("Unexpected error while saving friend: " + e.getMessage());
            throw new RuntimeException("Unexpected error: " + e.getMessage(), e);
        }
    }

    public void removeRequest(Integer senderId) {
        Integer receiverId = getCurrentUserId();
        // String senderUrl = "http://api-gateway:8090/api/auth/users/" + senderId;
        try {
            // UserDTO sender = restTemplate.getForObject(senderUrl, UserDTO.class);
            UserDTO sender = userClient.getUserById(senderId);
            if (sender == null) {
                throw new IllegalArgumentException("User with ID " + senderId + " does not exist.");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Error checking user existence: " + e.getMessage());
        }

        FriendRequest friendRequest = friendRequestRepository.findBySenderIdAndReceiverId(senderId, receiverId);

        if (friendRequest == null) {
            throw new IllegalStateException("You are not friends request from user " + senderId + ".");
        }

        if (friendRequest != null) {
            friendRequestRepository.delete(friendRequest);
        }
    }
}
