package com.example.friend_service.Client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.example.friend_service.DTO.FriendDTO;
import com.example.friend_service.DTO.UserDTO;

import lombok.RequiredArgsConstructor;

import java.util.Set;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserClient {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    private static final String QUEUE_NAME = "user_service.queue";

    public UserDTO getUserById(Long userId) {
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
}
