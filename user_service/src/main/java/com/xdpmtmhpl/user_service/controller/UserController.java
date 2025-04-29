package com.xdpmtmhpl.user_service.controller;

import com.xdpmtmhpl.user_service.dto.UpdateUserRequest;
import com.xdpmtmhpl.user_service.models.User;
import com.xdpmtmhpl.user_service.payload.response.MessageResponse;
import com.xdpmtmhpl.user_service.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

<<<<<<< Updated upstream
// @CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
=======
@CrossOrigin(origins = "all", maxAge = 3600, allowCredentials = "true")
>>>>>>> Stashed changes
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. Cập nhật thông tin user hiện tại
    @PutMapping("/me")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UpdateUserRequest updateUserRequest) {
        // Lấy thông tin user hiện tại từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        // Cập nhật thông tin
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

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User profile updated successfully!"));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        // Lấy thông tin user từ SecurityContext (dựa trên accessToken)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Lấy username từ token

        // Tìm user trong database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
<<<<<<< Updated upstream
    // @PreAuthorize("hasRole('ADMIN')") // Chỉ admin mới có thể truy cập
=======
    @PreAuthorize("hasRole('ADMIN')") // Chỉ admin mới có thể truy cập
>>>>>>> Stashed changes
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return ResponseEntity.ok(user);
    }
}