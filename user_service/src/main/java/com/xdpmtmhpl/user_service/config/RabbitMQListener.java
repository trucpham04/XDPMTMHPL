package com.xdpmtmhpl.user_service.config;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.xdpmtmhpl.user_service.dto.UpdateUserRequest;

@Component
public class RabbitMQListener {

    private final ObjectMapper objectMapper;

    public RabbitMQListener() {
        this.objectMapper = new ObjectMapper();
    }

    @RabbitListener(queues = "user_service.queue")
    public JsonNode handleRpc(JsonNode request) {
        try {
            if (request.get("type").asText().equals("user_info")) {
                System.out.println("Received notification request with User ID: " + request.get("user_id"));

                ObjectNode resultJson = objectMapper.createObjectNode();

                UpdateUserRequest updateUserRequest = new UpdateUserRequest();
                updateUserRequest.setBio("adasdasdasd");
                updateUserRequest.setFirstName("Nguyen");
                updateUserRequest.setLastName("Van A");
                updateUserRequest.setProfilePictureUrl("https://example.com/profile.jpg");

                resultJson = objectMapper.valueToTree(updateUserRequest);

                return resultJson;
            } else {
                JsonNode errorJson = objectMapper.createObjectNode()
                        .put("error", "Unknown request type");

                return errorJson;
            }
        } catch (Exception e) {
            e.printStackTrace();

            JsonNode errorJson = objectMapper.createObjectNode()
                    .put("error", e.getMessage());

            return errorJson;
        }
    }
}