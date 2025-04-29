package com.example.searchbackend.repository;

import com.example.searchbackend.model.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FriendRepository extends JpaRepository<Friend, Integer> {

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Friend f " +
            "WHERE (f.userId1 = :userId1 AND f.userId2 = :userId2) " +
            "OR (f.userId1 = :userId2 AND f.userId2 = :userId1)")
    boolean existsByUsers(Integer userId1, Integer userId2);
}
