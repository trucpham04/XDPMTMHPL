package com.xdpmtmhpl.message_service.dto;

import java.time.LocalDateTime;

import com.xdpmtmhpl.message_service.Enum.MessageType;

import lombok.Data;

@Data
public class ChatMessageDTO {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderFullName;
    private MessageType messageType;
    private String content;
    private String status;
    private LocalDateTime timestamp;
}
