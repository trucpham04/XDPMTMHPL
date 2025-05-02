package com.xdpmtmhpl.user_service.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.xdpmtmhpl.user_service.models.Role;
import com.xdpmtmhpl.user_service.models.User;
import com.xdpmtmhpl.user_service.payload.response.MessageResponse;
import com.xdpmtmhpl.user_service.repository.RoleRepository;
import com.xdpmtmhpl.user_service.repository.UserRepository;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.*;

@Data
class NewUserAdminResquest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    private String gender;

    @NotBlank
    private String dateOfBirth;

    private String firstName;
    private String lastName;
    private String profilePictureUrl;
    private Set<String> roles;
}

@Data
class UpdateUserAdminRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String gender;
    private String dateOfBirth;
    private String profilePictureUrl;
    private Set<String> roles;
}

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findAll(pageable);

        return ResponseEntity.ok(userPage);
    }

    @GetMapping("/users/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(keyword, keyword, pageable);

        return ResponseEntity.ok(userPage);
    }

    @PostMapping("/user/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addUser(@RequestBody NewUserAdminResquest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setGender(req.getGender());
        user.setDateOfBirth(LocalDate.parse(req.getDateOfBirth()));
        user.setProfilePictureUrl(req.getProfilePictureUrl());
        user.setIsActive(true);

        Set<Role> roles = extractRolesFromStrings(req.getRoles());
        user.setRoles(roles);

        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PutMapping("/user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserAdminRequest req) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
        }

        User user = userOpt.get();
        if (req.getEmail() != null)
            user.setEmail(req.getEmail());
        if (req.getFirstName() != null)
            user.setFirstName(req.getFirstName());
        if (req.getLastName() != null)
            user.setLastName(req.getLastName());
        if (req.getGender() != null)
            user.setGender(req.getGender());
        if (req.getDateOfBirth() != null)
            user.setDateOfBirth(LocalDate.parse(req.getDateOfBirth()));
        if (req.getProfilePictureUrl() != null)
            user.setProfilePictureUrl(req.getProfilePictureUrl());
        if (req.getRoles() != null)
            user.setRoles(extractRolesFromStrings(req.getRoles()));

        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User updated successfully."));
    }

    @PutMapping("/user/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
        }

        User user = userOpt.get();
        boolean newStatus = !user.getIsActive();
        user.setIsActive(newStatus);
        userRepository.save(user);

        String message = newStatus ? "User activated successfully." : "User deactivated successfully.";
        return ResponseEntity.ok(new MessageResponse(message));
    }

    private Set<Role> extractRolesFromStrings(Set<String> strRoles) {
        Set<Role> roles = new HashSet<>();
        if (strRoles == null || strRoles.isEmpty()) {
            roles.add(roleRepository.findByName(Role.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role ROLE_USER not found.")));
        } else {
            for (String roleStr : strRoles) {
                Role role;
                switch (roleStr) {
                    case "ROLE_ADMIN":
                        role = roleRepository.findByName(Role.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role ROLE_ADMIN not found."));
                        break;
                    case "ROLE_USER":
                    default:
                        role = roleRepository.findByName(Role.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role ROLE_USER not found."));
                        break;
                }
                roles.add(role);
            }
        }
        return roles;
    }
}
