package com.xdpmtmhpl.message_service.config;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

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
            chatMessage.put("type", "send_message");
            chatMessage.put("id", 1);
            chatMessage.put("conversationId", 1);
            chatMessage.put("content", "This is a content");

            JsonNode request = chatMessage;

            System.out.println("[Client] Requesting with JSON data: " + chatMessage.toString());

            JsonNode response = (JsonNode) rabbitTemplate
                    .convertSendAndReceive("notification_service.queue", request);

            if (response != null) {
                System.out.println("[Client] Response JSON result: " + response.get("notifications"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}