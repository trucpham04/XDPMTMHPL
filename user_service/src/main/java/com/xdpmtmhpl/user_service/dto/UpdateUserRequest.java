package com.xdpmtmhpl.user_service.dto;

import jakarta.validation.constraints.Size;

public class UpdateUserRequest {
    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Size(max = 255)
    private String bio;

    @Size(max = 255)
    private String profilePictureUrl;

    @Size(max = 255)
    private String coverPhotoUrl;

    // Getters và setters
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

    public String getCoverPhotoUrl() {
        return coverPhotoUrl;
    }

    public void setCoverPhotoUrl(String coverPhotoUrl) {
        this.coverPhotoUrl = coverPhotoUrl;
    }
}