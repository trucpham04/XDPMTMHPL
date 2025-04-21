package com.xdpmtmhpl.message_service.models;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

public class EventMessage<T> implements Serializable {
    private String messageId;
    private String messageType;
    private String sourceService;
    private Date timestamp;
    private T payload;

    // Default constructor required for deserialization
    public EventMessage() {
    }

    public EventMessage(String messageType, String sourceService, T payload) {
        this.messageId = UUID.randomUUID().toString();
        this.messageType = messageType;
        this.sourceService = sourceService;
        this.timestamp = new Date();
        this.payload = payload;
    }

    // Getters and setters
    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public String getSourceService() {
        return sourceService;
    }

    public void setSourceService(String sourceService) {
        this.sourceService = sourceService;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }

    @Override
    public String toString() {
        return "EventMessage{" +
                "messageId='" + messageId + '\'' +
                ", messageType='" + messageType + '\'' +
                ", sourceService='" + sourceService + '\'' +
                ", timestamp=" + timestamp +
                ", payload=" + payload +
                '}';
    }
}
