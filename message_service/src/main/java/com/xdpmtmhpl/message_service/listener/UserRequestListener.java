package com.xdpmtmhpl.message_service.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.xdpmtmhpl.message_service.service.ChatService;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserRequestListener {

    private static final Logger logger = LoggerFactory.getLogger(UserRequestListener.class);

    private final ChatService chatService;
    private final ObjectMapper objectMapper;

    @Value("${rabbitmq.queue.message}")
    private String queueName;

    @RabbitListener(queues = "${rabbitmq.queue.message}")
    public void handleUserRequest(String requestJson) {
        logger.debug("Received request: {}", requestJson);

        try {
            ObjectNode request = objectMapper.readValue(requestJson, ObjectNode.class);
            String type = request.get("type").asText();

            logger.info("Processing request type: {}", type);

            switch (type) {
                case "create_conversation": {
                    Long userId1 = request.get("user_id_1").asLong();
                    Long userId2 = request.get("user_id_2").asLong();

                    chatService.createConversation("Conversation", false, Arrays.asList(userId1, userId2));
                    logger.info("Created conversation between {} and {}", userId1, userId2);
                    break;
                }
                default:
                    logger.warn("Unknown request type: {}", type);
                    break;
            }
        } catch (Exception e) {
            logger.error("Failed to process user request: {}", requestJson, e);

            try {
                ObjectNode error = objectMapper.createObjectNode();
                error.put("error", "Failed to process user request: " + e.getMessage());
                logger.debug("Generated error response: {}", error.toPrettyString());
            } catch (Exception ex) {
                logger.error("Failed to generate error response", ex);
            }
        }
    }
}
