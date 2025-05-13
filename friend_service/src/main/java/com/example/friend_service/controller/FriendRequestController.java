package com.example.friend_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.friend_service.DTO.UserDTO;
import com.example.friend_service.Entity.FriendRequest;
import com.example.friend_service.service.FriendRequestService;

@RestController
@RequestMapping("/api/friends/requests")
public class FriendRequestController {
    @Autowired
    private FriendRequestService friendRequestService;

    @GetMapping("")
    public ResponseEntity<List<UserDTO>> getAllFriendRequests() {
        try {
            List<UserDTO> friendRequests = friendRequestService.getAllFriendRequests();
            return ResponseEntity.ok(friendRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);

        }
    }

    @GetMapping("/allsent")
    public ResponseEntity<List<UserDTO>> getAllRequestsSent() {
        try {
            List<UserDTO> requestSents = friendRequestService.getAllRequestSent();
            return ResponseEntity.ok(requestSents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);

        }
    }

    @PostMapping("/accept/{senderId}")
    public ResponseEntity<FriendRequest> acceptFriendRequest(@PathVariable("senderId") Integer senderId) {

        try {
            friendRequestService.acceptFriendRequest(senderId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/sent/{receiverId}")
    public ResponseEntity<FriendRequest> sendRequest(@PathVariable("receiverId") Integer receiverId) {
        try {
            friendRequestService.sendRequest(receiverId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/delete/{senderId}")
    public ResponseEntity<Void> removeFriend(@PathVariable("senderId") Integer senderId) {
        try {
            friendRequestService.removeRequest(senderId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/cancel/{receiverId}")
    public ResponseEntity<Void> cancelRequest(@PathVariable("receiverId") Integer receiverId) {
        try {
            friendRequestService.removeRequest(receiverId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
