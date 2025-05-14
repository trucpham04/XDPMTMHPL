package com.example.friend_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.friend_service.Entity.Friend;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Integer> {
    List<Friend> findByUser1Id(Integer user1Id);

    List<Friend> findByUser1IdIn(List<Integer> user1Ids);

    boolean existsByUser1IdAndUser2Id(Integer user1Id, Integer user2Id);

    Friend findByUser1IdAndUser2Id(Integer user1Id, Integer user2Id);

    Friend findByUser2IdAndUser1Id(Integer user2Id, Integer user1Id);

    List<Friend> findByUser2Id(Integer user2Id);

    default List<Friend> findFriendsByUserId(Integer userId) {
        List<Friend> asUser1 = findByUser1Id(userId);
        List<Friend> asUser2 = findByUser2Id(userId);
        asUser1.addAll(asUser2);
        return asUser1;
    }
}
