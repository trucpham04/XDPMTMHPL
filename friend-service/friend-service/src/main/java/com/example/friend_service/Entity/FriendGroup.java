package com.example.friend_service.Entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class FriendGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(nullable = false)
    private int userId;
    
    @Column(nullable = false)
    private String groupName;
}
