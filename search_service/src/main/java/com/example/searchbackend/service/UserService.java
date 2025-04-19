package com.example.searchbackend.service;

import com.example.searchbackend.model.User;
import com.example.searchbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Tìm kiếm người dùng theo tên
    public List<User> searchUsers(String query) {
        return userRepository.searchFlexible(query);

    }

}

