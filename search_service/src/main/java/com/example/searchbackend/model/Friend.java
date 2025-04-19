package com.example.searchbackend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "friends")
public class Friend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user1_id")
    private Integer userId1;

    @Column(name = "user2_id")
    private Integer userId2;

    // Getters & setters
    public Integer getId() { return id; }

    public Integer getUserId1() { return userId1; }
    public void setUserId1(Integer userId1) { this.userId1 = userId1; }

    public Integer getUserId2() { return userId2; }
    public void setUserId2(Integer userId2) { this.userId2 = userId2; }
}
