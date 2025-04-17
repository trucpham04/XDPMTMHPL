package com.xdpmtmhpl.message_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.xdpmtmhpl.message_service.Enum.MessageStatus;
import com.xdpmtmhpl.message_service.Enum.MessageType;
import com.xdpmtmhpl.message_service.dto.ChatMessageDTO;
import com.xdpmtmhpl.message_service.dto.UserDTO;
import com.xdpmtmhpl.message_service.models.Conversation;
import com.xdpmtmhpl.message_service.models.ConversationParticipant;
import com.xdpmtmhpl.message_service.models.Message;
import com.xdpmtmhpl.message_service.repository.ConversationParticipantRepository;
import com.xdpmtmhpl.message_service.repository.ConversationRepository;
import com.xdpmtmhpl.message_service.repository.MessageRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private ConversationParticipantRepository participantRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private WebSocketMessageService messageService;

    @Value("${user-service.url:http://localhost:8081}")
    private String userServiceUrl;

    @Override
    public WebSocketMessageService getMessagingService() {
        return messageService;
    }

    @Override
    public List<Conversation> getUserConversations(Long userId) {
        List<ConversationParticipant> userParticipations = participantRepository.findByUserId(userId);
        List<Long> conversationIds = userParticipations.stream()
                .map(participant -> participant.getConversation().getId())
                .collect(Collectors.toList());

        List<Conversation> conversations = conversationRepository.findAllById(conversationIds);

        // For each conversation, get the last message
        for (Conversation conversation : conversations) {
            List<Message> messages = messageRepository
                    .findTopByConversationIdOrderByTimestampDesc(conversation.getId());
            if (!messages.isEmpty()) {
                conversation.setLastMessage(messages.get(0));
            }
        }

        return conversations;
    }

    @Override
    public Conversation createConversation(String name, boolean isGroupChat, List<Long> participantIds) {
        // Create and save the conversation
        Conversation conversation = new Conversation();
        conversation.setName(name);
        conversation.setGroupChat(isGroupChat);
        conversation.setCreatedAt(LocalDateTime.now());
        conversation = conversationRepository.save(conversation);

        // Add participants
        List<ConversationParticipant> participants = new ArrayList<>();
        for (Long userId : participantIds) {
            ConversationParticipant participant = new ConversationParticipant();
            participant.setConversation(conversation);
            participant.setUserId(userId);
            participant.setJoinedAt(LocalDateTime.now());
            participants.add(participant);
        }

        participantRepository.saveAll(participants);

        // Fetch conversation with participants
        return conversationRepository.findById(conversation.getId()).orElse(conversation);
    }

    @Override
    public boolean isUserInConversation(Long userId, Long conversationId) {
        return participantRepository.findByConversationIdAndUserId(conversationId, userId).isPresent();
    }

    @Override
    public List<ChatMessageDTO> getConversationMessages(Long conversationId) {
        List<Message> messages = messageRepository.findByConversationIdOrderByTimestampDesc(conversationId);
        return messages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public void updateMessageStatus(Long messageId, String status) {
        Optional<Message> messageOpt = messageRepository.findById(messageId);
        if (messageOpt.isPresent()) {
            Message message = messageOpt.get();
            try {
                MessageStatus messageStatus = MessageStatus.valueOf(status.toUpperCase());
                message.setStatus(messageStatus);
                messageRepository.save(message);
            } catch (IllegalArgumentException e) {
                // Invalid status
                throw new IllegalArgumentException("Invalid message status: " + status);
            }
        }
    }

    @Override
    public ChatMessageDTO saveMessage(ChatMessageDTO messageDTO) {
        Message message = new Message();
        message.setConversationId(messageDTO.getConversationId());
        message.setSenderId(messageDTO.getSenderId());
        message.setContent(messageDTO.getContent());
        message.setType(messageDTO.getMessageType() != null ? messageDTO.getMessageType() : MessageType.TEXT);

        try {
            if (messageDTO.getStatus() != null) {
                message.setStatus(MessageStatus.valueOf(messageDTO.getStatus().toUpperCase()));
            } else {
                message.setStatus(MessageStatus.SENT);
            }
        } catch (IllegalArgumentException e) {
            message.setStatus(MessageStatus.SENT);
        }

        message.setTimestamp(LocalDateTime.now());

        if (messageDTO.getMediaUrl() != null && !messageDTO.getMediaUrl().isEmpty()) {
            message.setMediaUrl(messageDTO.getMediaUrl());
        }

        Message savedMessage = messageRepository.save(message);
        return convertToDTO(savedMessage);
    }

    @Override
    public ChatMessageDTO sendMessage(Long conversationId, Long senderId, String content,
            MessageType messageType, String mediaUrl) {
        // First, check if user is in the conversation
        if (!isUserInConversation(senderId, conversationId)) {
            throw new RuntimeException("User is not a participant in this conversation");
        }

        // Create and save the message
        Message message = new Message();
        message.setConversationId(conversationId);
        message.setSenderId(senderId);
        message.setContent(content);
        message.setType(messageType != null ? messageType : MessageType.TEXT);
        message.setStatus(MessageStatus.SENT);
        message.setTimestamp(LocalDateTime.now());

        if (mediaUrl != null && !mediaUrl.isEmpty()) {
            message.setMediaUrl(mediaUrl);
        }

        Message savedMessage = messageRepository.save(message);
        ChatMessageDTO messageDTO = convertToDTO(savedMessage);

        // Send the message using the WebSocketMessageService instead of
        // SimpMessagingTemplate
        messageService.sendToConversation(conversationId, messageDTO);

        return messageDTO;
    }

    @Override
    public UserDTO getUserById(Long userId) {
        try {
            ResponseEntity<UserDTO> response = restTemplate.getForEntity(
                    userServiceUrl + "/api/users/{userId}",
                    UserDTO.class,
                    userId);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            // Log the error
        }

        // Fallback to a default user if user service is unavailable
        UserDTO defaultUser = new UserDTO();
        defaultUser.setId(userId);
        defaultUser.setUsername("user" + userId);
        defaultUser.setDisplayName("User " + userId);

        return defaultUser;
    }

    @Override
    public UserDTO getUserByUsername(String username) {
        try {
            ResponseEntity<UserDTO> response = restTemplate.getForEntity(
                    userServiceUrl + "/api/users/username/{username}",
                    UserDTO.class,
                    username);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            // Log the error
        }

        // Fallback to a default user if user service is unavailable
        UserDTO defaultUser = new UserDTO();
        defaultUser.setId(1L);
        defaultUser.setUsername(username);
        defaultUser.setDisplayName(username);

        return defaultUser;
    }

    private ChatMessageDTO convertToDTO(Message message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setConversationId(message.getConversationId());
        dto.setSenderId(message.getSenderId());
        dto.setContent(message.getContent());
        dto.setMessageType(message.getType());
        dto.setStatus(message.getStatus().toString());
        dto.setTimestamp(message.getTimestamp());

        if (message.getMediaUrl() != null) {
            dto.setMediaUrl(message.getMediaUrl());
        }

        // Fetch sender information using RestTemplate
        try {
            UserDTO user = getUserById(message.getSenderId());
            dto.setSenderUsername(user.getUsername());
        } catch (Exception e) {
            // In case of error, set default values
            dto.setSenderUsername("unknown");
        }

        return dto;
    }
}