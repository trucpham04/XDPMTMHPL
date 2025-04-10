package com.xdpmtmhpl.user_service.security.services;

import com.xdpmtmhpl.user_service.models.Role;
import com.xdpmtmhpl.user_service.models.User;
import com.xdpmtmhpl.user_service.payload.request.LoginRequest;
import com.xdpmtmhpl.user_service.payload.request.SignupRequest;
import com.xdpmtmhpl.user_service.payload.response.JwtResponse;
import com.xdpmtmhpl.user_service.payload.response.UserProfileResponse;
import com.xdpmtmhpl.user_service.repository.RoleRepository;
import com.xdpmtmhpl.user_service.repository.UserRepository;
import com.xdpmtmhpl.user_service.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // @Autowired
    // private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    public ResponseEntity<JwtResponse> signup(SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }
    
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(signupRequest.getPassword()); // Lưu mật khẩu dưới dạng plain text
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
    
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(Role.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role ROLE_USER not found."));
        roles.add(userRole);
        user.setRoles(roles);
    
        userRepository.save(user);
    
        // Chuyển đổi Set<Role> thành List<String>
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
    
        String jwt = jwtUtils.generateTokenFromUsername(user.getUsername(), jwtUtils.getJwtProperties().expirationMs());
        String refreshToken = jwtUtils.generateRefreshToken(user.getUsername());
    
        // Create cookies
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(jwt);
        ResponseCookie refreshCookie = jwtUtils.generateRefreshJwtCookie(refreshToken);
    
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(new JwtResponse(
                        jwt,              // token
                        "Bearer",         // type
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        roleNames));
    }

    public ResponseEntity<JwtResponse> login(LoginRequest loginRequest) {
        // Sử dụng AuthenticationManager để xác thực
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        org.springframework.security.core.userdetails.User userDetails = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

        String jwt = jwtUtils.generateJwtToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails.getUsername());

        // Create cookies
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(jwt);
        ResponseCookie refreshCookie = jwtUtils.generateRefreshJwtCookie(refreshToken);

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Chuyển đổi Set<Role> thành List<String>
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(new JwtResponse(
                        jwt,              // token
                        "Bearer",         // type
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        roleNames));
    }

    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFirstName() + " " + user.getLastName());
        response.setProfilePicture(user.getProfilePictureUrl());
        response.setBio(user.getBio());

        return response;
    }
}