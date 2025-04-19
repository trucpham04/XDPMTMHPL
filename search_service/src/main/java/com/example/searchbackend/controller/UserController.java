//package com.example.searchbackend.controller;
//
//import com.example.searchbackend.service.UserService;
//import com.example.searchbackend.model.User;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//@CrossOrigin(origins = "http://localhost:5173")
//@RestController
//@RequestMapping("/api/users")
//public class UserController {
//
//    @Autowired
//    private UserService userService;
//
//    // Endpoint tìm kiếm người dùng theo tên
//    @GetMapping("/search/users")
//    public List<User> searchUsers(@RequestParam String query) {
//        return userService.searchUsers(query);
//    }
//
//
//}
package com.example.searchbackend.controller;

import com.example.searchbackend.model.RelationStatus;
import com.example.searchbackend.model.User;
import com.example.searchbackend.model.UserSearchDTO;
import com.example.searchbackend.service.SearchService;
import com.example.searchbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private SearchService searchService;
    @Autowired
    private UserService userService;

    // ✅ Tìm kiếm người dùng có kèm theo trạng thái quan hệ
    @GetMapping("/search/users")
    public List<UserSearchDTO> searchUsers(@RequestParam String query, @RequestParam int currentUserId) {
        List<User> users = userService.searchUsers(query);

        return users.stream()
                .filter(user -> !user.getId().equals(currentUserId)) // Không trả về chính mình
                .map(user -> {
                    RelationStatus relation = searchService.getRelationStatus(currentUserId, user.getId());
                    return new UserSearchDTO(user, relation);
                })
                .collect(Collectors.toList());
    }


}

