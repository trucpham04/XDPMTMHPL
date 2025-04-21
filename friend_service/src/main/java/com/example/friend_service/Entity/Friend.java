package com.example.friend_service.Entity;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "friends")
public class Friend {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    
    @Column(name = "user1_id", nullable = false)
    private Integer user1Id;

    @Column(name = "user2_id", nullable = false)
    private Integer user2Id;

    @Column(nullable = false)
    private LocalDateTime friendshipDate;
}
