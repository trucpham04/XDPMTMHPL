package com.example.friend_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.friend_service.Entity.Friend;

public interface FriendRepository extends JpaRepository<Friend, Integer>{
    List<Friend> findByUser1Id(Integer user1Id);
    List<Friend> findByUser1IdIn(List<Integer> user1Ids);
    boolean existsByUser1IdAndUser2Id(Integer user1Id, Integer user2Id);
    Friend findByUser1IdAndUser2Id(Integer user1Id, Integer user2Id);
    Friend findByUser2IdAndUser1Id(Integer user2Id, Integer user1Id);
}
