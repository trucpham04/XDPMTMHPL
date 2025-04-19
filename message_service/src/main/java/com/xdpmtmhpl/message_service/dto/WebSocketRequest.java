package com.xdpmtmhpl.message_service.dto;

import com.fasterxml.jackson.databind.JsonNode;

public class WebSocketRequest {
    private String action;
    private Long conversationId;
    private JsonNode data;

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public JsonNode getData() {
        return data;
    }

    public void setData(JsonNode data) {
        this.data = data;
    }
}