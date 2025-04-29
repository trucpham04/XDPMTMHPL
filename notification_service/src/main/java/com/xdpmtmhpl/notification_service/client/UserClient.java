package com.xdpmtmhpl.notification_service.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.xdpmtmhpl.notification_service.dto.UserDTO;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserClient {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    private static final String QUEUE_NAME = "user_service.queue";

    public UserDTO getUserById(Long userId) {
        if (userId == 2) {
            return createMockUserDTO();
        }

        rabbitTemplate.setReplyTimeout(3000);

        ObjectNode requestMap = objectMapper.createObjectNode();
        requestMap.put("type", "get_user_by_id");
        requestMap.put("userId", userId);

        try {
            String requestJson = objectMapper.writeValueAsString(requestMap);

            String responseJson = (String) rabbitTemplate.convertSendAndReceive(QUEUE_NAME, requestJson);

            if (responseJson == null) {
                return null;
            }

            return objectMapper.readValue(responseJson, UserDTO.class);

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch UserDTO from User Service", e);
        }
    }

    private UserDTO createMockUserDTO() {
        UserDTO mockUser = new UserDTO();
        mockUser.setId(2L);
        mockUser.setUsername("testUser");
        mockUser.setEmail("testuser@example.com");
        mockUser.setPhoneNumber("123-456-7890");
        mockUser.setFirstName("John");
        mockUser.setLastName("Doe");
        mockUser.setDateOfBirth(LocalDate.of(1990, 1, 1));
        mockUser.setGender("Male");
        mockUser.setBio("This is a bio.");
        mockUser.setProfilePictureUrl("http://example.com/profile.jpg");
        mockUser.setCoverPhotoUrl("http://example.com/cover.jpg");
        mockUser.setIsVerified(true);
        mockUser.setIsActive(true);
        mockUser.setCreatedAt(LocalDateTime.now());
        mockUser.setUpdatedAt(LocalDateTime.now());
        mockUser.setLastLoginAt(LocalDateTime.now());
        mockUser.setRoles(Set.of("USER", "ADMIN"));

        return mockUser;
    }
}
