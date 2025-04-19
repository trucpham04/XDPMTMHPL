package com.example.searchbackend.repository;
import com.example.searchbackend.model.Post;
import com.example.searchbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByContentContainingIgnoreCase(String content);
    List<Post> findAllByUserIdIn(Set<Integer> userIds);
}
