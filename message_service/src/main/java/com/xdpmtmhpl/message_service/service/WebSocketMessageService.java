package com.xdpmtmhpl.message_service.service;

import com.xdpmtmhpl.message_service.config.ChatWebSocketHandler;
import com.xdpmtmhpl.message_service.dto.ChatMessageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class WebSocketMessageService {

    @Autowired
    private ChatWebSocketHandler chatWebSocketHandler;

    public void sendToConversation(Long conversationId, ChatMessageDTO message) {
        try {
            chatWebSocketHandler.sendMessageToConversation(message);
        } catch (IOException e) {
            // Handle exception or log error
            e.printStackTrace();
        }
    }

    public void sendToUser(Long userId, ChatMessageDTO message) {
        try {
            chatWebSocketHandler.sendMessageToUser(userId, message);
        } catch (IOException e) {
            // Handle exception or log error
            e.printStackTrace();
        }
    }
}