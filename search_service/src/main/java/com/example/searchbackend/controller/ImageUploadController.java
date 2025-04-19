package com.example.searchbackend.controller;

import com.example.searchbackend.model.User;
import com.example.searchbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/images")
public class ImageUploadController {

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Đường dẫn thư mục uploads trong thư mục gốc project
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;

            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs(); // Tạo thư mục nếu chưa có
            }

            // Làm sạch tên file: giữ lại chữ, số, dấu chấm, gạch ngang
            String originalName = file.getOriginalFilename();
            String cleanedFileName = originalName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");

            String fileName = System.currentTimeMillis() + "_" + cleanedFileName;
            File destination = new File(uploadDir + fileName);
            file.transferTo(destination);

            String imageUrl = "http://localhost:8080/images/" + fileName;
            return ResponseEntity.ok(imageUrl);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lưu ảnh: " + e.getMessage());
        }
    }
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file,
                                               @RequestParam("userId") Integer userId) {
        try {
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String originalName = file.getOriginalFilename();
            String cleanedFileName = originalName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
            String fileName = System.currentTimeMillis() + "_" + cleanedFileName;

            File destination = new File(uploadDir + fileName);
            file.transferTo(destination);

            String imageUrl = "http://localhost:8080/images/" + fileName;

            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                user.setAvatarUrl(imageUrl);
                userRepository.save(user);
                return ResponseEntity.ok(imageUrl);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User không tồn tại với ID = " + userId);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi upload avatar: " + e.getMessage());
        }
    }

}
