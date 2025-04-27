package com.example.searchbackend.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PostResponseDTO {
    private Integer id;
    private String content;
    private String privacyLevel;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private AuthorDTO author;

    // Inner class: AuthorDTO
    public static class AuthorDTO {
        private Integer id;
        private String firstName;
        private String lastName;
        private String avatarUrl;

        public AuthorDTO() {
        }

        public AuthorDTO(Integer id, String firstName, String lastName, String avatarUrl) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.avatarUrl = avatarUrl;
        }

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

        public String getAvatarUrl() {
            return avatarUrl;
        }

        public void setAvatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
        }

        public String getFullName() {
            return firstName + " " + lastName;
        }
    }
}
