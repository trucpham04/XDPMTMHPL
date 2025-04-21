package com.example.friend_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.friend_service.Entity.FriendGroup;

public interface FriendGroupRepository extends JpaRepository<FriendGroup, Integer>{
    List<FriendGroup> findByUserId(Integer userId);
    
}
