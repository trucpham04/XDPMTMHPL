package com.example.friend_service.service;

import java.time.LocalDate;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

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

import com.example.friend_service.DTO.FriendDTO;
import com.example.friend_service.Entity.FriendRequest;
import com.example.friend_service.Repository.FriendRequestRepository;

@Service
public class FriendRequestService {
    @Autowired
    private FriendRequestRepository friendRequestRepository;

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

    public List<FriendDTO> getAllFriendRequests(){
        Integer receiverId= getCurrentUserId();
        List <FriendRequest> friends= friendRequestRepository.findByReceiverId(receiverId);
        Function<FriendRequest, FriendDTO> toUserDTO = friendRequest -> {
            String userServiceUrl = "https://30d3d25d-e531-436a-a0eb-8c0129d2c599.mock.pstmn.io/api/users/" + friendRequest.getSenderId() + "/basic";
            return restTemplate.getForObject(userServiceUrl, FriendDTO.class);
        };
        return friends.stream()
                .map(toUserDTO)
                .collect(Collectors.toList());
    }

    public List<FriendDTO> getAllRequestSent(){
        Integer senderId= getCurrentUserId();
        List <FriendRequest> friends= friendRequestRepository.findBySenderId(senderId);
        Function<FriendRequest, FriendDTO> toUserDTO = friendRequest -> {
            
            String userServiceUrl = "https://30d3d25d-e531-436a-a0eb-8c0129d2c599.mock.pstmn.io/api/users/" + friendRequest.getReceiverId() + "/basic";
            return restTemplate.getForObject(userServiceUrl, FriendDTO.class);
        };
        return friends.stream()
                .map(toUserDTO)
                .collect(Collectors.toList());
    }

    public FriendRequest SendRequest(Integer receiverId){
        try {
            Integer senderId= getCurrentUserId();
            String receiverUrl = "https://30d3d25d-e531-436a-a0eb-8c0129d2c599.mock.pstmn.io/api/users/" + receiverId + "/basic";
            FriendDTO receiver= restTemplate.getForObject(receiverUrl, FriendDTO.class);
            if (receiver == null) {
                throw new IllegalArgumentException("User with ID " + receiverId + " does not exist.");
            }           
            boolean alreadyFriendRequest = friendRequestRepository.existsBySenderIdAndReceiverId(senderId, receiverId); 
            if (alreadyFriendRequest) {
                throw new IllegalStateException("You are request friends with user " + receiverId + ".");
            }

            FriendRequest friendRequest=new FriendRequest();
            friendRequest.setSenderId(senderId);
            friendRequest.setReceiverId(receiverId);
            friendRequest.setTime(LocalDate.now());
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

    public void removeRequest (Integer senderId){
        Integer receiverId= getCurrentUserId();
        String senderUrl= "https://30d3d25d-e531-436a-a0eb-8c0129d2c599.mock.pstmn.io/api/users/" + senderId + "/basic";
        try {
            FriendDTO sender = restTemplate.getForObject(senderUrl, FriendDTO.class);
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

        if (friendRequest != null ){
            friendRequestRepository.delete(friendRequest);
        }
    }
}
