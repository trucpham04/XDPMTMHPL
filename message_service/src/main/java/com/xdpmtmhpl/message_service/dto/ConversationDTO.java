package com.xdpmtmhpl.message_service.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ConversationDTO {
    private Long id;
    private String name;
    private boolean isGroupChat;
    private LocalDateTime createdAt;
    private List<Long> participantIds = new ArrayList<>();
    private ChatMessageDTO lastMessage;
    private UserDTO otherUser;
}
