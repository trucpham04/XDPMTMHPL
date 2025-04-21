package com.xdpmtmhpl.message_service.service;

import com.xdpmtmhpl.message_service.constants.RabbitMQConstants;
import com.xdpmtmhpl.message_service.models.EventMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQMessagePublisher implements MessagePublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${spring.application.name}")
    private String serviceName;

    public RabbitMQMessagePublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public <T> void publishToService(String targetService, String messageType, T payload) {
        EventMessage<T> message = new EventMessage<>(messageType, serviceName, payload);
        String routingKey = String.format(RabbitMQConstants.SERVICE_ROUTING_KEY_PATTERN, targetService);
        rabbitTemplate.convertAndSend(RabbitMQConstants.MAIN_EXCHANGE, routingKey, message);
    }

    @Override
    public <T> void publishToTopic(String topic, String messageType, T payload) {
        EventMessage<T> message = new EventMessage<>(messageType, serviceName, payload);
        String routingKey = String.format(RabbitMQConstants.TOPIC_ROUTING_KEY_PATTERN, topic);
        rabbitTemplate.convertAndSend(RabbitMQConstants.MAIN_EXCHANGE, routingKey, message);
    }

    @Override
    public <T> void broadcastToAll(String messageType, T payload) {
        EventMessage<T> message = new EventMessage<>(messageType, serviceName, payload);
        rabbitTemplate.convertAndSend(RabbitMQConstants.BROADCAST_EXCHANGE, "", message);
    }

    public <T, R> R sendRpcRequest(String exchange, String routingKey, T payload, Class<R> responseType) {
        Object response = rabbitTemplate.convertSendAndReceive(exchange, routingKey, payload);
        if (responseType.isInstance(response)) {
            return responseType.cast(response);
        }
        return null;
    }
}
