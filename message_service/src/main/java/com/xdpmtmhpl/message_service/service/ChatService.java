package com.xdpmtmhpl.message_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xdpmtmhpl.message_service.Enum.MessageStatus;
import com.xdpmtmhpl.message_service.Enum.MessageType;
import com.xdpmtmhpl.message_service.client.UserServiceClient;
import com.xdpmtmhpl.message_service.dto.ChatMessageDTO;
import com.xdpmtmhpl.message_service.dto.UserDTO;
import com.xdpmtmhpl.message_service.models.Conversation;
import com.xdpmtmhpl.message_service.models.ConversationParticipant;
import com.xdpmtmhpl.message_service.models.Message;
import com.xdpmtmhpl.message_service.repository.ConversationParticipantRepository;
import com.xdpmtmhpl.message_service.repository.ConversationRepository;
import com.xdpmtmhpl.message_service.repository.MessageRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private ConversationParticipantRepository participantRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserServiceClient userServiceClient;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Returns the messaging template used for WebSocket communication
     */
    public SimpMessagingTemplate getMessagingTemplate() {
        return this.messagingTemplate;
    }

    /**
     * Checks if a user is a participant in a conversation
     * 
     * @param userId         The ID of the user
     * @param conversationId The ID of the conversation
     * @return true if the user is a participant, false otherwise
     */
    public boolean isUserInConversation(Long userId, Long conversationId) {
        return participantRepository.findByConversationIdAndUserId(conversationId, userId).isPresent();
    }

    @Transactional
    public Conversation createConversation(String name, boolean isGroupChat, List<Long> participantUserIds) {
        // Create new conversation
        Conversation conversation = new Conversation();
        conversation.setName(name);
        conversation.setGroupChat(isGroupChat);
        conversation = conversationRepository.save(conversation);

        // Add participants
        for (Long userId : participantUserIds) {
            ConversationParticipant participant = new ConversationParticipant();
            participant.setConversation(conversation);
            participant.setUserId(userId);
            participantRepository.save(participant);
        }

        return conversation;
    }

    @Transactional
    public Message sendMessage(Long conversationId, Long senderId, String content,
            MessageType messageType, String mediaUrl) {
        // Verify that the conversation exists
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        // Verify that the sender is a participant
        Optional<ConversationParticipant> participant = participantRepository
                .findByConversationIdAndUserId(conversationId, senderId);

        if (participant.isEmpty()) {
            throw new RuntimeException("User is not a participant in this conversation");
        }

        // Create and save message
        Message message = new Message();
        message.setConversation(conversation);
        message.setSenderId(senderId);
        message.setContent(content);
        message.setMessageType(messageType);
        message.setMediaUrl(mediaUrl);
        message.setStatus(MessageStatus.SENT);

        // Save to database
        message = messageRepository.save(message);

        // Convert to DTO and broadcast to all participants
        ChatMessageDTO messageDTO = convertToDTO(message);

        messagingTemplate.convertAndSend("/topic/conversation." + conversationId, messageDTO);

        // Also send to specific users (useful for when users are in multiple chat
        // windows)
        for (ConversationParticipant p : participantRepository.findByConversationId(conversationId)) {
            messagingTemplate.convertAndSendToUser(
                    p.getUserId().toString(),
                    "/queue/messages",
                    messageDTO);
        }

        return message;
    }

    public List<ChatMessageDTO> getConversationMessages(Long conversationId) {
        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);

        // Get unique sender IDs to batch fetch user data
        List<Long> senderIds = messages.stream()
                .map(Message::getSenderId)
                .distinct()
                .collect(Collectors.toList());

        // Batch fetch user data from user service
        Map<Long, UserDTO> userMap = userServiceClient.getUsersByIds(senderIds);

        // Convert messages to DTOs with user data
        return messages.stream()
                .map(message -> {
                    ChatMessageDTO dto = convertToDTO(message);
                    UserDTO sender = userMap.get(message.getSenderId());
                    if (sender != null) {
                        dto.setSenderUsername(sender.getUsername());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<Conversation> getUserConversations(Long userId) {
        List<ConversationParticipant> participations = participantRepository.findByUserId(userId);
        List<Conversation> conversations = new ArrayList<>();

        for (ConversationParticipant participant : participations) {
            conversations.add(participant.getConversation());
        }

        return conversations;
    }

    private ChatMessageDTO convertToDTO(Message message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setConversationId(message.getConversation().getId());
        dto.setSenderId(message.getSenderId());
        dto.setContent(message.getContent());
        dto.setMessageType(message.getMessageType());
        dto.setMediaUrl(message.getMediaUrl());
        dto.setStatus(message.getStatus().toString());
        dto.setTimestamp(message.getCreatedAt());

        // Note: We don't set senderUsername here because it might require a service
        // call
        // This should be set by the caller when needed

        return dto;
    }

    @Transactional
    public void updateMessageStatus(Long messageId, MessageStatus status) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setStatus(status);
        messageRepository.save(message);

        // Notify relevant users of status change
        ChatMessageDTO messageDTO = convertToDTO(message);
        messagingTemplate.convertAndSend(
                "/topic/conversation." + message.getConversation().getId() + ".status",
                messageDTO);
    }
}