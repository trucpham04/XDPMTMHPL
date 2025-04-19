package com.xdpmtmhpl.message_service.service;

import com.xdpmtmhpl.message_service.Enum.MessageStatus;
import com.xdpmtmhpl.message_service.Enum.MessageType;
import com.xdpmtmhpl.message_service.dto.ChatMessageDTO;
import com.xdpmtmhpl.message_service.dto.UserDTO;
import com.xdpmtmhpl.message_service.dto.WebSocketRequest;
import com.xdpmtmhpl.message_service.models.Conversation;
import com.xdpmtmhpl.message_service.models.ConversationParticipant;
import com.xdpmtmhpl.message_service.models.Message;
import com.xdpmtmhpl.message_service.repository.ConversationParticipantRepository;
import com.xdpmtmhpl.message_service.repository.ConversationRepository;
import com.xdpmtmhpl.message_service.repository.MessageRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Service for handling chat functionality and WebSocket messaging
 */
@Service
public class ChatService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private ConversationParticipantRepository participantRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Value("${user-service.url:http://localhost:8081}")
    private String userServiceUrl;

    private final Map<Long, Map<String, WebSocketSession>> conversationSessions = new ConcurrentHashMap<>();

    @Autowired
    private ObjectMapper objectMapper;

    // === CONVERSATION MANAGEMENT METHODS ===

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

    public boolean isUserInConversation(Long userId, Long conversationId) {
        return participantRepository.findByConversationIdAndUserId(conversationId, userId).isPresent();
    }

    // === MESSAGE MANAGEMENT METHODS ===

    public List<ChatMessageDTO> getConversationMessages(Long conversationId) {
        List<Message> messages = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
        return messages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

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

        // Send to conversation using WebSocket (previously a separate service method)
        try {
            sendToConversation(conversationId, messageDTO);
        } catch (Exception e) {
            // Log error but don't fail the operation
            e.printStackTrace();
        }

        return messageDTO;
    }

    // === USER DATA METHODS ===

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

    // === WEBSOCKET MESSAGING METHODS ===

    /**
     * Sends a message to all users in a conversation
     *
     * @param conversationId The ID of the conversation
     * @param message        The message to send
     * @return true if message was sent successfully, false otherwise
     */
    public boolean sendToConversation(Long conversationId, ChatMessageDTO message) {
        try {
            // Ensure the conversation ID is set
            message.setConversationId(conversationId);

            // Save the message first (if not already saved)
            if (message.getId() == null) {
                message = saveMessage(message);
            }

            // Then broadcast it to all participants in the conversation
            broadcastToConversation(conversationId, message);
            return true;
        } catch (IOException e) {
            // Log the error
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Sends a notification message to a specific user
     * 
     * @param userId  The ID of the user to send the message to
     * @param message The message to send
     * @return true if the message was processed, false otherwise
     */
    public boolean sendToUser(Long userId, ChatMessageDTO message) {
        try {
            // Get user information
            UserDTO user = getUserById(userId);

            // Create a system notification for the user
            // This will need to be delivered when the user connects or joins relevant
            // conversations
            ChatMessageDTO notification = new ChatMessageDTO();
            notification.setSenderId(message.getSenderId());
            notification.setSenderUsername(message.getSenderUsername());
            notification.setContent(message.getContent());
            notification.setMessageType(MessageType.SYSTEM);

            // Store the notification for delivery
            // saveNotification(userId, notification);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Sends a typing notification for a conversation
     *
     * @param conversationId The conversation ID
     * @param userId         The ID of the user who is typing
     * @return true if successful, false otherwise
     */
    public boolean sendTypingNotification(Long conversationId, Long userId) {
        try {
            // Create typing notification request data
            ObjectNode dataNode = objectMapper.createObjectNode();

            // Create a WebSocketRequest object to simulate a typing notification
            WebSocketRequest request = new WebSocketRequest();
            request.setAction("TYPING");
            request.setConversationId(conversationId);
            request.setData(dataNode);

            // Get user details
            UserDTO user = getUserById(userId);

            // Create and broadcast the typing notification
            ChatMessageDTO typingNotification = new ChatMessageDTO();
            typingNotification.setConversationId(conversationId);
            typingNotification.setSenderId(userId);
            typingNotification.setSenderUsername(user.getUsername());
            typingNotification.setMessageType(MessageType.SYSTEM);
            typingNotification.setContent("TYPING");

            // Broadcast to the conversation
            broadcastToConversation(conversationId, typingNotification);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Creates and sends a system message to a conversation
     *
     * @param conversationId The conversation ID
     * @param content        The system message content
     * @return true if successful, false otherwise
     */
    public boolean sendSystemMessage(Long conversationId, String content) {
        try {
            ChatMessageDTO systemMessage = new ChatMessageDTO();
            systemMessage.setConversationId(conversationId);
            systemMessage.setMessageType(MessageType.SYSTEM);
            systemMessage.setContent(content);

            // Save and broadcast
            ChatMessageDTO savedMessage = saveMessage(systemMessage);
            broadcastToConversation(conversationId, savedMessage);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public void broadcastToConversation(Long conversationId, ChatMessageDTO message) throws IOException {
        String messageJson = objectMapper.writeValueAsString(message);
        TextMessage textMessage = new TextMessage(messageJson);

        if (conversationSessions.containsKey(conversationId)) {
            Map<String, WebSocketSession> sessions = conversationSessions.get(conversationId);

            for (WebSocketSession session : sessions.values()) {
                if (session.isOpen()) {
                    session.sendMessage(textMessage);
                }
            }
        }
    }

    public void sendError(WebSocketSession session, String errorMessage) throws IOException {
        Map<String, Object> errorResponse = Map.of(
                "type", "ERROR",
                "message", errorMessage);

        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(errorResponse)));
    }

    public WebSocketRequest parseRequest(String payload) {
        try {
            return objectMapper.readValue(payload, WebSocketRequest.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    public Map<String, String> extractQueryParameters(WebSocketSession session) {
        // Extract query parameters from the URI
        Map<String, String> params = new ConcurrentHashMap<>();

        String uri = session.getUri().toString();
        int queryStartIndex = uri.indexOf('?');

        if (queryStartIndex > 0) {
            String query = uri.substring(queryStartIndex + 1);
            String[] pairs = query.split("&");

            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    params.put(keyValue[0], keyValue[1]);
                }
            }
        }

        return params;
    }

    // Method to add a session to a conversation
    public void addSessionToConversation(Long conversationId, String sessionId, WebSocketSession session) {
        conversationSessions.computeIfAbsent(conversationId, k -> new ConcurrentHashMap<>())
                .put(sessionId, session);
    }

    public void removeSessionFromConversation(Long conversationId, String sessionId, WebSocketSession session) {
        conversationSessions.computeIfAbsent(conversationId, k -> new ConcurrentHashMap<>())
                .remove(sessionId, session);
    }

    // Method to remove a session from a conversation
    public void removeSessionFromConversation(Long conversationId, String sessionId) {
        if (conversationSessions.containsKey(conversationId)) {
            conversationSessions.get(conversationId).remove(sessionId);

            // Clean up empty maps
            if (conversationSessions.get(conversationId).isEmpty()) {
                conversationSessions.remove(conversationId);
            }
        }
    }
}