package com.xdpmtmhpl.user_service.service;

import com.xdpmtmhpl.user_service.dto.UserDTO;
import com.xdpmtmhpl.user_service.models.User;
import com.xdpmtmhpl.user_service.models.Role;
import com.xdpmtmhpl.user_service.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    public UserDTO getUserById(Long userId) {
        logger.debug("Fetching user with ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return mapToUserDTO(user);
    }

    public UserDTO getUserByToken(String token) {
        logger.debug("Validating token and fetching user");
        String email = validateToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return mapToUserDTO(user);
    }

    private UserDTO mapToUserDTO(User user) {
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
        userDTO.setIsVerified(user.getIsVerified());
        userDTO.setIsActive(user.getIsActive());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setUpdatedAt(user.getUpdatedAt());
        userDTO.setLastLoginAt(user.getLastLoginAt());
        userDTO.setRoles(user.getRoles().stream()
                .map(Role::getName) // Ánh xạ tên vai trò
                .collect(Collectors.toSet()));
        return userDTO;
    }

    private String validateToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }
        try {
            String jwtToken = token.substring(7); // Bỏ "Bearer "
            return Jwts.parserBuilder()
                    .setSigningKey(jwtSecret.getBytes()) // Chuyển secret thành bytes
                    .build()
                    .parseClaimsJws(jwtToken)
                    .getBody()
                    .getSubject(); // Subject là email
        } catch (Exception e) {
            throw new RuntimeException("Failed to validate token", e);
        }
    }
}