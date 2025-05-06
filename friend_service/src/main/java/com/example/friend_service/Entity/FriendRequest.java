package com.example.friend_service.Entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="friends_request")
public class FriendRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int senderId;

    @Column(nullable =false)
    private int receiverId;

    @Column(nullable = false)
    private LocalDate time;
}
