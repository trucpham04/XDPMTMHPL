package com.xdpmtmhpl.message_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.xdpmtmhpl.message_service.Enum.MessageStatus;
import com.xdpmtmhpl.message_service.dto.ChatMessageDTO;
import com.xdpmtmhpl.message_service.dto.ConversationDTO;
import com.xdpmtmhpl.message_service.models.Conversation;
import com.xdpmtmhpl.message_service.service.ChatService;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getUserConversations(Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);

        List<Conversation> conversations = chatService.getUserConversations(userId);
        List<ConversationDTO> conversationDTOs = conversations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(conversationDTOs);
    }

    @PostMapping("/conversations")
    public ResponseEntity<ConversationDTO> createConversation(
            @RequestBody ConversationDTO conversationRequest,
            Principal principal) {

        Long userId = getUserIdFromPrincipal(principal);

        // Make sure the current user is included in participants
        if (!conversationRequest.getParticipantIds().contains(userId)) {
            conversationRequest.getParticipantIds().add(userId);
        }

        Conversation conversation = chatService.createConversation(
                conversationRequest.getName(),
                conversationRequest.isGroupChat(),
                conversationRequest.getParticipantIds());

        return ResponseEntity.ok(convertToDTO(conversation));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getConversationMessages(
            @PathVariable Long conversationId,
            Principal principal) {

        // Verify user has access to this conversation
        Long userId = getUserIdFromPrincipal(principal);
        if (!chatService.isUserInConversation(userId, conversationId)) {
            return ResponseEntity.status(403).build();
        }

        List<ChatMessageDTO> messages = chatService.getConversationMessages(conversationId);
        return ResponseEntity.ok(messages);
    }

    @PutMapping("/messages/{messageId}/status")
    public ResponseEntity<?> updateMessageStatus(
            @PathVariable Long messageId,
            @RequestParam("status") String status,
            Principal principal) {

        // Convert string status to enum
        MessageStatus messageStatus;
        try {
            messageStatus = MessageStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value");
        }

        chatService.updateMessageStatus(messageId, messageStatus);
        return ResponseEntity.ok().build();
    }

    // Helper methods

    private Long getUserIdFromPrincipal(Principal principal) {
        // This will depend on your authentication mechanism
        // Similar to the implementation in ChatController
        return 0L; // Placeholder
    }

    private ConversationDTO convertToDTO(Conversation conversation) {
        ConversationDTO dto = new ConversationDTO();
        dto.setId(conversation.getId());
        dto.setName(conversation.getName());
        dto.setGroupChat(conversation.isGroupChat());
        dto.setCreatedAt(conversation.getCreatedAt());

        // Get participant IDs
        dto.setParticipantIds(conversation.getParticipants().stream()
                .map(participant -> participant.getUserId())
                .collect(Collectors.toList()));

        return dto;
    }
}
