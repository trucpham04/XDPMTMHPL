package com.example.friend_service.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserDTO {

    private Integer id;
    private String username;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    private String gender;
    private String bio;
    private String profilePictureUrl;
    private String coverPhotoUrl;
    private Boolean isVerified;
    private Boolean isActive;
    private Integer mutualFriends;
    private String requestTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastLoginAt;

    private Set<String> roles;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public Integer getMutualFriends() {
        return mutualFriends;
    }

    public void setMutualFriends(Integer mutualFriends) {
        this.mutualFriends = mutualFriends;
    }

    public String getRequestTime() {
        return requestTime;
    }

    public void setRequestTime(String requestTime) {
        this.requestTime = requestTime;
    }
}