package com.xdpmtmhpl.user_service.payload.request;

public class LoginRequest {
    private String identifier; // Có thể là username hoặc email
    private String password;

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}