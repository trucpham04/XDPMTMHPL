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

import com.example.friend_service.DTO.FriendDTO;
import com.example.friend_service.Entity.Friend;
import com.example.friend_service.service.FriendService;

@RestController
@RequestMapping("/api/friends")
public class FriendController {
    @Autowired
    private FriendService friendService;

    @GetMapping
    public ResponseEntity<List<FriendDTO>> getAllFriends() {
        try {
            List<FriendDTO> friends = friendService.getAllFriends();
            return ResponseEntity.ok(friends);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping("/{user2Id}")
    public ResponseEntity<Friend> addFriend(@PathVariable("user2Id") Integer user2Id) {

        try {
            Friend savedFriend = friendService.addFriend(user2Id);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedFriend);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{user2Id}")
    public ResponseEntity<Void> removeFriend(@PathVariable("user2Id") Integer user2Id) {
        try {
            friendService.removeFriend(user2Id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
