package com.example.friend_service.Client;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageClient {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public void createConversation(Integer userId1, Integer userId2) {
        rabbitTemplate.setReplyTimeout(3000);

        ObjectNode requestMap = objectMapper.createObjectNode();
        requestMap.put("type", "create_conversation");
        requestMap.put("user_id_1", userId1);
        requestMap.put("user_id_2", userId2);

        try {
            String requestJson = objectMapper.writeValueAsString(requestMap);
            rabbitTemplate.convertAndSend("message_service.queue", requestJson);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send create conversation request", e);
        }
    }

}
