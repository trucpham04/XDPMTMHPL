package com.xdpmtmhpl.notification_service.config;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.xdpmtmhpl.notification_service.dto.NotificationDTO;

@Component
public class RabbitMQListener {

    private final ObjectMapper objectMapper;

    public RabbitMQListener() {
        this.objectMapper = new ObjectMapper();
    }

    @RabbitListener(queues = "notification_service.queue")
    public JsonNode handleRpc(JsonNode request) {
        try {
            if (request.get("type").asText().equals("send_message")) {
                System.out.println("Received notification request with JSON: " + request.toString());

                NotificationDTO notificationDTO1 = new NotificationDTO();
                notificationDTO1.setId(Long.valueOf(1));
                notificationDTO1.setMessage("This is a message from DTO");

                // DTO sang JSON cho 1 DTO
                JsonNode notification = objectMapper.valueToTree(notificationDTO1);

                NotificationDTO notificationDTO2 = new NotificationDTO();

                notificationDTO2.setId(Long.valueOf(1));
                notificationDTO2.setMessage("This is a message from DTO");
                NotificationDTO notificationDTO3 = new NotificationDTO();

                notificationDTO3.setId(Long.valueOf(1));
                notificationDTO3.setMessage("This is a message from DTO");
                NotificationDTO notificationDTO4 = new NotificationDTO();

                notificationDTO4.setId(Long.valueOf(1));
                notificationDTO4.setMessage("This is a message from DTO");

                // DTO sang JSON cho nhiều DTO
                ArrayNode notifications = objectMapper.createArrayNode();
                notifications.add(objectMapper.valueToTree(notificationDTO2));
                notifications.add(objectMapper.valueToTree(notificationDTO3));
                notifications.add(objectMapper.valueToTree(notificationDTO4));

                ObjectNode resultJson = objectMapper.createObjectNode();
                resultJson.put("processed", true);
                resultJson.put("timestamp", System.currentTimeMillis());
                resultJson.put("message", "Successfully processed notification for content: " + request.toString());

                resultJson.set("notification", notification); // JSON con
                resultJson.set("notifications", notifications); // JSON con la 1 mang

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