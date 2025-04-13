package com.example.friend_service.DTO;

import java.sql.Date;

import lombok.Data;

@Data
public class FriendDTO {
    private int id;
    private String firstName;
    private String lastName;
    private String avatar;
    private Date dateOfBirth;
}
