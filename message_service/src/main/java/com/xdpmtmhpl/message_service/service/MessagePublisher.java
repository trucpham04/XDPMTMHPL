package com.xdpmtmhpl.message_service.service;

public interface MessagePublisher {
    <T> void publishToService(String targetService, String messageType, T payload);

    <T> void publishToTopic(String topic, String messageType, T payload);

    <T> void broadcastToAll(String messageType, T payload);
}
