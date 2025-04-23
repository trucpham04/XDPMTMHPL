package com.xdpmtmhpl.message_service.config;

import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.xdpmtmhpl.message_service.dto.notification.NotificationDTO;

@Component
public class RabbitMQSender implements CommandLineRunner {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public RabbitMQSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void run(String... args) {
        try {
            ObjectNode chatMessage = objectMapper.createObjectNode();
            chatMessage.put("type", "user_info");
            chatMessage.put("user_id", 1);

            JsonNode request = chatMessage;

            System.out.println("[Client] Requesting with JSON data: " + chatMessage.toString());

            JsonNode response = (JsonNode) rabbitTemplate
                    .convertSendAndReceive("user_service.queue", request);

            System.out.println("[Client] Received response: " + response.toString());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}