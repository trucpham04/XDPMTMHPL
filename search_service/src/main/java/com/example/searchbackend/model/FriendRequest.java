package com.example.searchbackend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "friend_request")
public class FriendRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sender_id", nullable = false)
    private Integer senderId;

    @Column(name = "receiver_id", nullable = false)
    private Integer receiverId;

    // Optional: thêm createdAt nếu bạn muốn lưu thời gian gửi lời mời
    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    public FriendRequest() {}

    public FriendRequest(Integer senderId, Integer receiverId) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.createdAt = java.time.LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public Integer getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Integer receiverId) {
        this.receiverId = receiverId;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
