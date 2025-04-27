package com.xdpmtmhpl.notification_service.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserDTO {

    private Long id;
    private String username;
    private String email;
    private String phoneNumber;

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bio;
    private String profilePictureUrl;
    private String coverPhotoUrl;
    private Boolean isVerified;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;

    private Set<String> roles;
}
