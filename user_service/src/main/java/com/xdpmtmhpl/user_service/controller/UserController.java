package com.xdpmtmhpl.user_service.controller;

import com.xdpmtmhpl.user_service.dto.UpdateUserRequest;
import com.xdpmtmhpl.user_service.dto.UserDTO;
import com.xdpmtmhpl.user_service.models.User;
import com.xdpmtmhpl.user_service.payload.response.MessageResponse;
import com.xdpmtmhpl.user_service.repository.UserRepository;
import com.xdpmtmhpl.user_service.service.UserService;

import jakarta.validation.Valid;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<Page<UserDTO>> getAllUsers(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<UserDTO> userDTOs = userService.getAllUsers(page, size);

        return ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        List<User> usersByName = userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query,
                query);

        if (usersByName.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<UserDTO> userDTOs = usersByName.stream()
                .map(user -> {
                    UserDTO userDTO = new UserDTO();
                    userDTO.setId(user.getId());
                    userDTO.setUsername(user.getUsername());
                    userDTO.setEmail(user.getEmail());
                    userDTO.setPhoneNumber(user.getPhoneNumber());
                    userDTO.setFirstName(user.getFirstName());
                    userDTO.setLastName(user.getLastName());
                    userDTO.setDateOfBirth(user.getDateOfBirth());
                    userDTO.setGender(user.getGender());
                    userDTO.setBio(user.getBio());
                    userDTO.setProfilePictureUrl(user.getProfilePictureUrl());
                    userDTO.setCoverPhotoUrl(user.getCoverPhotoUrl());
                    return userDTO;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDTOs);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UpdateUserRequest updateUserRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        if (updateUserRequest.getFirstName() != null) {
            user.setFirstName(updateUserRequest.getFirstName());
        }
        if (updateUserRequest.getLastName() != null) {
            user.setLastName(updateUserRequest.getLastName());
        }
        if (updateUserRequest.getBio() != null) {
            user.setBio(updateUserRequest.getBio());
        }
        if (updateUserRequest.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(updateUserRequest.getProfilePictureUrl());
        }
        if (updateUserRequest.getCoverPhotoUrl() != null) {
            user.setCoverPhotoUrl(updateUserRequest.getCoverPhotoUrl());
        }

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User profile updated successfully!"));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return ResponseEntity.ok(user);
    }
}