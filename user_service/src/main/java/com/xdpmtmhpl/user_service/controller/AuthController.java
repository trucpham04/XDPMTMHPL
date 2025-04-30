package com.xdpmtmhpl.user_service.controller;

import com.xdpmtmhpl.user_service.models.Role;
import com.xdpmtmhpl.user_service.models.User;
import com.xdpmtmhpl.user_service.payload.request.LoginRequest;
import com.xdpmtmhpl.user_service.payload.request.SignupRequest;
import com.xdpmtmhpl.user_service.payload.response.JwtResponse;
import com.xdpmtmhpl.user_service.payload.response.MessageResponse;
import com.xdpmtmhpl.user_service.payload.response.UserProfileResponse;
import com.xdpmtmhpl.user_service.repository.RoleRepository;
import com.xdpmtmhpl.user_service.repository.UserRepository;
import com.xdpmtmhpl.user_service.security.jwt.JwtUtils;
import com.xdpmtmhpl.user_service.security.services.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

// @CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getIdentifier(), loginRequest.getPassword()));
<<<<<<< Updated upstream

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Sử dụng userDetails thay vì authentication
        String jwt = jwtUtils.generateJwtToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails.getUsername());

=======
    
        SecurityContextHolder.getContext().setAuthentication(authentication);
    
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    
        // Sử dụng userDetails thay vì authentication
        String jwt = jwtUtils.generateJwtToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails.getUsername());
    
>>>>>>> Stashed changes
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(jwt);
        ResponseCookie refreshCookie = jwtUtils.generateRefreshJwtCookie(refreshToken);
    
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
<<<<<<< Updated upstream

        User user = userRepository.findByUsername(userDetails.getUsername())
                .or(() -> userRepository.findByEmail(loginRequest.getIdentifier()))
                .orElseThrow(
                        () -> new RuntimeException("User not found with identifier: " + loginRequest.getIdentifier()));

=======
    
        User user = userRepository.findByUsername(userDetails.getUsername())
                .or(() -> userRepository.findByEmail(loginRequest.getIdentifier()))
                .orElseThrow(() -> new RuntimeException("User not found with identifier: " + loginRequest.getIdentifier()));
    
>>>>>>> Stashed changes
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
    
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(new JwtResponse(
<<<<<<< Updated upstream
                        jwt, // token
                        "Bearer", // type
=======
                        jwt,              // token
                        "Bearer",         // type
>>>>>>> Stashed changes
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(signUpRequest.getPassword()); // Lưu mật khẩu dạng plain text
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(Role.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role ROLE_USER not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(Role.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role ROLE_ADMIN not found."));
                        roles.add(adminRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(Role.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role ROLE_USER not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        String refreshToken = jwtUtils.getJwtRefreshFromCookies(request);

        if (refreshToken == null) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Refresh token is missing"));
        }

        if (jwtUtils.validateJwtToken(refreshToken)) {
            String username = jwtUtils.getUserNameFromJwtToken(refreshToken);

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

<<<<<<< Updated upstream
            String newAccessToken = jwtUtils.generateTokenFromUsername(username,
                    jwtUtils.getJwtProperties().expirationMs());
=======
            String newAccessToken = jwtUtils.generateTokenFromUsername(username, jwtUtils.getJwtProperties().expirationMs());
>>>>>>> Stashed changes
            ResponseCookie accessCookie = jwtUtils.generateJwtCookie(newAccessToken);

            List<String> roles = user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toList());

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                    .body(new JwtResponse(
<<<<<<< Updated upstream
                            newAccessToken, // token
                            "Bearer", // type
=======
                            newAccessToken,   // token
                            "Bearer",         // type
>>>>>>> Stashed changes
                            user.getId(),
                            user.getUsername(),
                            user.getEmail(),
                            roles));
        }

        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Invalid refresh token"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        ResponseCookie accessCookie = jwtUtils.getCleanJwtCookie();
        ResponseCookie refreshCookie = jwtUtils.getCleanJwtRefreshCookie();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(new MessageResponse("You've been logged out!"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
<<<<<<< Updated upstream
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal() instanceof String) {
=======
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() instanceof String) {
>>>>>>> Stashed changes
            return ResponseEntity.status(401).build();
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFirstName() + " " + user.getLastName());
        response.setProfilePicture(user.getProfilePictureUrl());
        response.setBio(user.getBio());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFirstName() + " " + user.getLastName());
        response.setProfilePicture(user.getProfilePictureUrl());
        response.setBio(user.getBio());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}")
<<<<<<< Updated upstream
    public ResponseEntity<MessageResponse> updateUser(@PathVariable Long id,
            @RequestBody UserUpdateRequest updateRequest) {
=======
    public ResponseEntity<MessageResponse> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest updateRequest) {
>>>>>>> Stashed changes
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Unauthorized"));
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Kiểm tra quyền: Chỉ cho phép người dùng cập nhật thông tin của chính họ
        if (!user.getUsername().equals(authentication.getName())) {
            return ResponseEntity.status(403).body(new MessageResponse("You can only update your own profile"));
        }

        // Cập nhật thông tin
<<<<<<< Updated upstream
        if (updateRequest.getFirstName() != null)
            user.setFirstName(updateRequest.getFirstName());
        if (updateRequest.getLastName() != null)
            user.setLastName(updateRequest.getLastName());
        if (updateRequest.getEmail() != null)
            user.setEmail(updateRequest.getEmail());
        if (updateRequest.getBio() != null)
            user.setBio(updateRequest.getBio());
        if (updateRequest.getProfilePictureUrl() != null)
            user.setProfilePictureUrl(updateRequest.getProfilePictureUrl());
=======
        if (updateRequest.getFirstName() != null) user.setFirstName(updateRequest.getFirstName());
        if (updateRequest.getLastName() != null) user.setLastName(updateRequest.getLastName());
        if (updateRequest.getEmail() != null) user.setEmail(updateRequest.getEmail());
        if (updateRequest.getBio() != null) user.setBio(updateRequest.getBio());
        if (updateRequest.getProfilePictureUrl() != null) user.setProfilePictureUrl(updateRequest.getProfilePictureUrl());
>>>>>>> Stashed changes

        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User updated successfully"));
    }
}

class UserUpdateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String bio;
    private String profilePictureUrl;

<<<<<<< Updated upstream
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
=======
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
>>>>>>> Stashed changes
}