package com.example.searchbackend.controller;

import com.example.searchbackend.model.PostResponseDTO;
import com.example.searchbackend.model.User;
import com.example.searchbackend.service.PostService;
import com.example.searchbackend.model.Post;
import com.example.searchbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/post")

public class PostController {

    @Autowired
    private PostService postService;


    @GetMapping("/search/posts")
    public List<PostResponseDTO> searchPosts(@RequestParam String query) {
        return postService.searchPosts(query);
    }
}
