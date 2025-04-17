package com.xdpmtmhpl.message_service.dto;

public class MessageBroadcastEvent {
    private final Long conversationId;
    private final ChatMessageDTO message;

    public MessageBroadcastEvent(Long conversationId, ChatMessageDTO message) {
        this.conversationId = conversationId;
        this.message = message;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public ChatMessageDTO getMessage() {
        return message;
    }
}
