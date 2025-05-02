package com.example.friend_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.friend_service.Entity.FriendGroupMember;

public interface FriendGroupMemberRepository extends JpaRepository<FriendGroupMember, Integer> {
    List<FriendGroupMember> findByGroupId(Integer groupId);
    
}
