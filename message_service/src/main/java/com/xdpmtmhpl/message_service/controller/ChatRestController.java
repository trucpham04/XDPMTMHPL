package com.xdpmtmhpl.message_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.xdpmtmhpl.message_service.dto.ChatMessageDTO;
import com.xdpmtmhpl.message_service.dto.ConversationCreateRequestDTO;
import com.xdpmtmhpl.message_service.dto.ConversationDTO;
import com.xdpmtmhpl.message_service.dto.UserDTO;
import com.xdpmtmhpl.message_service.models.Conversation;
import com.xdpmtmhpl.message_service.models.Message;
import com.xdpmtmhpl.message_service.repository.MessageRepository;
import com.xdpmtmhpl.message_service.service.ChatService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private MessageRepository messageRepository;

    // Get all conversations for a user
    @GetMapping("/conversations/{userId}")
    public ResponseEntity<List<ConversationDTO>> getUserConversations(@PathVariable Long userId) {
        List<Conversation> conversations = chatService.getUserConversations(userId);
        List<ConversationDTO> conversationDTOs = conversations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(conversationDTOs);
    }

    // Create a new conversation
    @PostMapping("/conversations")
    public ResponseEntity<ConversationDTO> createConversation(@RequestBody ConversationCreateRequestDTO request) {

        Conversation conversation = chatService.createConversation(
                request.getName(),
                request.isGroupChat(),
                request.getParticipantIds());

        return ResponseEntity.ok(convertToDTO(conversation));
    }

    // Get messages for a conversation
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getConversationMessages(@PathVariable Long conversationId) {
        List<ChatMessageDTO> messages = chatService.getConversationMessages(conversationId);
        return ResponseEntity.ok(messages);
    }

    // Update message status
    @PatchMapping("/messages/{messageId}/status")
    public ResponseEntity<?> updateMessageStatus(
            @PathVariable Long messageId,
            @RequestBody Map<String, String> statusUpdate) {

        try {
            String status = statusUpdate.get("status");
            chatService.updateMessageStatus(messageId, status);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value: " + e.getMessage());
        }
    }

    // Check if user is in conversation
    @GetMapping("/conversations/{conversationId}/users/{userId}")
    public ResponseEntity<Boolean> isUserInConversation(
            @PathVariable Long conversationId,
            @PathVariable Long userId) {
        boolean isInConversation = chatService.isUserInConversation(userId, conversationId);
        return ResponseEntity.ok(isInConversation);
    }

    private ConversationDTO convertToDTO(Conversation conversation) {
        ConversationDTO dto = new ConversationDTO();
        dto.setId(conversation.getId());
        dto.setName(conversation.getName());
        dto.setGroupChat(conversation.isGroupChat());
        dto.setCreatedAt(conversation.getCreatedAt());

        // Get participants from conversation participants
        List<Long> participantIds = conversation.getParticipants().stream()
                .map(participant -> participant.getUserId())
                .collect(Collectors.toList());
        dto.setParticipantIds(participantIds);

        // Set last message if available
        Message lastMessage = messageRepository
                .findLastMessageByConversationId(conversation.getId());

        if (lastMessage != null) {
            ChatMessageDTO lastMessageDTO = new ChatMessageDTO();
            lastMessageDTO.setId(lastMessage.getId());
            lastMessageDTO.setConversationId(lastMessage.getConversationId());
            lastMessageDTO.setSenderId(lastMessage.getSenderId());
            lastMessageDTO.setContent(lastMessage.getContent());
            lastMessageDTO.setMessageType(lastMessage.getType());
            lastMessageDTO.setStatus(lastMessage.getStatus().toString());
            lastMessageDTO.setTimestamp(lastMessage.getTimestamp());

            // Get sender username
            UserDTO sender = chatService.getUserById(lastMessage.getSenderId());
            if (sender != null) {
                lastMessageDTO.setSenderUsername(sender.getUsername());
            }

            dto.setLastMessage(lastMessageDTO);
        }

        return dto;
    }

}