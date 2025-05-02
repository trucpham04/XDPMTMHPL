package com.xdpmtmhpl.user_service.controller;

import com.xdpmtmhpl.user_service.dto.UpdateUserRequest;
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
import org.springframework.data.domain.PageRequest;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Sử dụng userDetails thay vì authentication
        String jwt = jwtUtils.generateJwtToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails.getUsername());

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(jwt);
        ResponseCookie refreshCookie = jwtUtils.generateRefreshJwtCookie(refreshToken);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        User user = userRepository.findByUsername(userDetails.getUsername())
                .or(() -> userRepository.findByEmail(loginRequest.getIdentifier()))
                .orElseThrow(
                        () -> new RuntimeException("User not found with identifier: " + loginRequest.getIdentifier()));

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(new JwtResponse(
                        jwt, // token
                        "Bearer", // type
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

            String newAccessToken = jwtUtils.generateTokenFromUsername(username,
                    jwtUtils.getJwtProperties().expirationMs());
            ResponseCookie accessCookie = jwtUtils.generateJwtCookie(newAccessToken);

            List<String> roles = user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toList());

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                    .body(new JwtResponse(
                            newAccessToken, // token
                            "Bearer", // type
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
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal() instanceof String) {
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

    // @PutMapping("/users/{id}")
    // public ResponseEntity<MessageResponse> updateUser(@PathVariable Long id,
    //         @RequestBody UserUpdateRequest updateRequest) {
    //     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    //     if (authentication == null || !authentication.isAuthenticated()) {
    //         return ResponseEntity.status(401).body(new MessageResponse("Unauthorized"));
    //     }

    //     User user = userRepository.findById(id)
    //             .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

    //     // Kiểm tra quyền: Chỉ cho phép người dùng cập nhật thông tin của chính họ
    //     if (!user.getUsername().equals(authentication.getName())) {
    //         return ResponseEntity.status(403).body(new MessageResponse("You can only update your own profile"));
    //     }

    //     // Cập nhật thông tin
    //     if (updateRequest.getFirstName() != null)
    //         user.setFirstName(updateRequest.getFirstName());
    //     if (updateRequest.getLastName() != null)
    //         user.setLastName(updateRequest.getLastName());
    //     if (updateRequest.getEmail() != null)
    //         user.setEmail(updateRequest.getEmail());
    //     if (updateRequest.getBio() != null)
    //         user.setBio(updateRequest.getBio());
    //     if (updateRequest.getProfilePictureUrl() != null)
    //         user.setProfilePictureUrl(updateRequest.getProfilePictureUrl());

    //     userRepository.save(user);
    //     return ResponseEntity.ok(new MessageResponse("User updated successfully"));
    // }

    @PutMapping("/users/{id}")
public ResponseEntity<MessageResponse> updateUser(@PathVariable Long id,
        @RequestBody UpdateUserRequest updateRequest) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(401).body(new MessageResponse("Không được phép"));
    }

    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id: " + id));

    // Kiểm tra quyền: Chỉ cho phép người dùng cập nhật thông tin của chính họ
    if (!user.getUsername().equals(authentication.getName())) {
        return ResponseEntity.status(403).body(new MessageResponse("Bạn chỉ có thể cập nhật hồ sơ của chính mình"));
    }

    // Cập nhật thông tin
    if (updateRequest.getFirstName() != null)
        user.setFirstName(updateRequest.getFirstName());
    if (updateRequest.getLastName() != null)
        user.setLastName(updateRequest.getLastName());
    if (updateRequest.getBio() != null)
        user.setBio(updateRequest.getBio());
    if (updateRequest.getProfilePictureUrl() != null)
        user.setProfilePictureUrl(updateRequest.getProfilePictureUrl());

    userRepository.save(user);
    return ResponseEntity.ok(new MessageResponse("Cập nhật người dùng thành công"));
}


// @GetMapping("/users/search")
// public ResponseEntity<List<UserProfileResponse>> searchUsers(@RequestParam String name) {
//     if (name == null || name.trim().isEmpty()) {
//         return ResponseEntity.badRequest().body(null);
//     }

//     // Tìm kiếm người dùng theo tên, họ hoặc tên đăng nhập (không phân biệt hoa thường)
//     List<User> users = userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(
//             name, name, name);

//     // Chuyển đổi sang UserProfileResponse
//     List<UserProfileResponse> response = users.stream().map(user -> {
//         UserProfileResponse profile = new UserProfileResponse();
//         profile.setId(user.getId());
//         profile.setUsername(user.getUsername());
//         profile.setEmail(user.getEmail());
//         profile.setFullName(user.getFirstName() + " " + user.getLastName());
//         profile.setProfilePicture(user.getProfilePictureUrl());
//         profile.setBio(user.getBio());
//         return profile;
//     }).collect(Collectors.toList());

//     return ResponseEntity.ok(response);
// }

@GetMapping("/users/search")
    public ResponseEntity<?> searchUsers(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Lỗi: Từ khóa tìm kiếm không được để trống"));
        }

        if (name.length() < 2) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Lỗi: Từ khóa tìm kiếm phải có ít nhất 2 ký tự"));
        }

        // Tạo đối tượng Pageable
        Pageable pageable = PageRequest.of(page, size);

        // Tìm kiếm với phân trang
        Page<User> userPage = userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(
                name, name, name, pageable);

        // Chuyển đổi sang UserProfileResponse
        List<UserProfileResponse> response = userPage.getContent().stream().map(user -> {
            UserProfileResponse profile = new UserProfileResponse();
            profile.setId(user.getId());
            profile.setUsername(user.getUsername());
            profile.setEmail(user.getEmail());
            profile.setFullName(user.getFirstName() + " " + user.getLastName());
            profile.setProfilePicture(user.getProfilePictureUrl());
            profile.setBio(user.getBio());
            return profile;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

// class UserUpdateRequest {
//     private String firstName;
//     private String lastName;
//     private String email;
//     private String bio;
//     private String profilePictureUrl;

//     public String getFirstName() {
//         return firstName;
//     }

//     public void setFirstName(String firstName) {
//         this.firstName = firstName;
//     }

//     public String getLastName() {
//         return lastName;
//     }

//     public void setLastName(String lastName) {
//         this.lastName = lastName;
//     }

//     public String getEmail() {
//         return email;
//     }

//     public void setEmail(String email) {
//         this.email = email;
//     }

//     public String getBio() {
//         return bio;
//     }

//     public void setBio(String bio) {
//         this.bio = bio;
//     }

//     public String getProfilePictureUrl() {
//         return profilePictureUrl;
//     }

//     public void setProfilePictureUrl(String profilePictureUrl) {
//         this.profilePictureUrl = profilePictureUrl;
//     }
//     }
}