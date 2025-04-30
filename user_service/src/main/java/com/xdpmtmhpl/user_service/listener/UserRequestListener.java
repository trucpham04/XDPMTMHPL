package com.xdpmtmhpl.user_service.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.xdpmtmhpl.user_service.dto.UserDTO;
import com.xdpmtmhpl.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserRequestListener {

    private static final Logger logger = LoggerFactory.getLogger(UserRequestListener.class);

    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Value("${rabbitmq.queue.message}")
    private String queueName;

    @RabbitListener(queues = "${rabbitmq.queue.message}")
    public String handleUserRequest(String requestJson) {
        logger.debug("Received request: {}", requestJson);
        try {
            ObjectNode request = objectMapper.readValue(requestJson, ObjectNode.class);
            String type = request.get("type").asText();

            switch (type) {
                case "get_user_by_id":
                    Long userId = request.get("userId").asLong();
                    logger.debug("Processing get_user_by_id for userId: {}", userId);
                    UserDTO userDTOById = userService.getUserById(userId);
                    return objectMapper.writeValueAsString(userDTOById);

                case "get_user_by_token":
                    String token = request.get("token").asText();
                    logger.debug("Processing get_user_by_token");
                    UserDTO userDTOByToken = userService.getUserByToken(token);
                    return objectMapper.writeValueAsString(userDTOByToken);

                default:
                    logger.warn("Unknown request type: {}", type);
                    throw new RuntimeException("Unknown request type: " + type);
            }
        } catch (Exception e) {
            logger.error("Failed to process user request: {}", requestJson, e);
            ObjectNode error = objectMapper.createObjectNode();
            error.put("error", "Failed to process user request: " + e.getMessage());
            try {
                return objectMapper.writeValueAsString(error);
            } catch (Exception ex) {
                logger.error("Failed to serialize error response", ex);
                return "{\"error\": \"Internal server error\"}";
            }
        }
    }
}