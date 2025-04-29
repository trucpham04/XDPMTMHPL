package com.example.friend_service.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class FriendGroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int groupId;

    @Column(nullable = false)
    private int friendId;
}
