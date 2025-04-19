package com.xdpmtmhpl.user_service.payload.response;

import lombok.Data;

@Data
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String profilePicture;
    private String bio;
}