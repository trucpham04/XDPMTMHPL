package com.xdpmtmhpl.message_service.service;

import com.xdpmtmhpl.message_service.Enum.MessageStatus;
import com.xdpmtmhpl.message_service.Enum.MessageType;
import com.xdpmtmhpl.message_service.dto.ChatMessageDTO;
import com.xdpmtmhpl.message_service.dto.ConversationDTO;
import com.xdpmtmhpl.message_service.dto.UserDTO;
import com.xdpmtmhpl.message_service.dto.WebSocketRequest;
import com.xdpmtmhpl.message_service.models.Conversation;
import com.xdpmtmhpl.message_service.models.ConversationParticipant;
import com.xdpmtmhpl.message_service.models.Message;
import com.xdpmtmhpl.message_service.repository.ConversationParticipantRepository;
import com.xdpmtmhpl.message_service.repository.ConversationRepository;
import com.xdpmtmhpl.message_service.repository.MessageRepository;

import jakarta.servlet.http.HttpServletRequest;

import com.xdpmtmhpl.message_service.client.UserClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
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
    private ConversationRepository conversationRepository;

    @Autowired
    private ConversationParticipantRepository participantRepository;

    @Autowired
    private MessageRepository messageRepository;

    private final Map<Long, Map<String, WebSocketSession>> conversationSessions = new ConcurrentHashMap<>();

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserClient userClient;

    private String getAuthToken() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            if (request.getCookies() != null) {
                for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                    if ("jwt".equals(cookie.getName())) {
                        return cookie.getValue();
                    }
                }
            }
        }
        throw new IllegalStateException("No JWT token found in cookie.");
    }

    private Long getCurrentUserId() {
        String token = getAuthToken();
        try {
            UserDTO currentUser = userClient.getUserByToken(token);
            if (currentUser != null) {
                return currentUser.getId();
            }
            throw new IllegalStateException("Could not retrieve current user information.");
        } catch (Exception e) {
            throw new IllegalStateException("Error retrieving current user: " + e.getMessage());
        }
    }

    // === CONVERSATION MANAGEMENT METHODS ===

    public List<ConversationDTO> getUserConversations() {
        Long userId = getCurrentUserId();
        List<ConversationParticipant> userParticipations = participantRepository.findByUserId(userId);
        List<Long> conversationIds = userParticipations.stream()
                .map(participant -> participant.getConversation().getId())
                .collect(Collectors.toList());

        List<Conversation> conversations = conversationRepository.findAllById(conversationIds);

        List<ConversationDTO> result = new ArrayList<>();

        for (Conversation conversation : conversations) {
            ConversationParticipant otherParticipant = conversation.getParticipants()
                    .stream()
                    .filter(p -> !p.getUserId().equals(userId))
                    .findFirst()
                    .orElse(null);

            if (otherParticipant == null)
                continue;

            UserDTO otherUser = userClient.getUserById(otherParticipant.getUserId());

            ConversationDTO dto = new ConversationDTO();
            dto.setId(conversation.getId());
            dto.setName(conversation.getName());
            dto.setGroupChat(conversation.isGroupChat());
            dto.setCreatedAt(conversation.getCreatedAt());
            dto.setOtherUser(otherUser);

            List<Message> messages = messageRepository
                    .findTopByConversationIdOrderByTimestampDesc(conversation.getId());

            if (!messages.isEmpty()) {
                Message lastMessage = messages.get(0);
                ChatMessageDTO messageDTO = new ChatMessageDTO();
                messageDTO.setId(lastMessage.getId());
                messageDTO.setContent(lastMessage.getContent());
                messageDTO.setTimestamp(lastMessage.getTimestamp());
                dto.setLastMessage(messageDTO);
            }

            result.add(dto);
        }

        result.sort((c1, c2) -> {
            if (c1.getLastMessage() == null && c2.getLastMessage() == null)
                return 0;
            if (c1.getLastMessage() == null)
                return 1;
            if (c2.getLastMessage() == null)
                return -1;
            return c2.getLastMessage().getTimestamp().compareTo(c1.getLastMessage().getTimestamp());
        });

        return result;
    }

    public Conversation createConversation(String name, boolean isGroupChat, List<Long> participantIds) {
        Conversation conversation = new Conversation();
        conversation.setName(name);
        conversation.setGroupChat(isGroupChat);
        conversation.setCreatedAt(LocalDateTime.now());
        conversation = conversationRepository.save(conversation);

        List<ConversationParticipant> participants = new ArrayList<>();
        for (Long userId : participantIds) {
            UserDTO user = userClient.getUserById(userId);
            ConversationParticipant participant = new ConversationParticipant();
            participant.setConversation(conversation);
            participant.setUserId(user.getId());
            participant.setJoinedAt(LocalDateTime.now());
            participants.add(participant);
        }

        participantRepository.saveAll(participants);

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

        Message savedMessage = messageRepository.save(message);
        return convertToDTO(savedMessage);
    }

    public ChatMessageDTO sendMessage(Long conversationId, Long senderId, String content,
            MessageType messageType, String mediaUrl) {
        if (!isUserInConversation(senderId, conversationId)) {
            throw new RuntimeException("User is not a participant in this conversation");
        }

        Message message = new Message();
        message.setConversationId(conversationId);
        message.setSenderId(senderId);
        message.setContent(content);
        message.setType(messageType != null ? messageType : MessageType.TEXT);
        message.setStatus(MessageStatus.SENT);
        message.setTimestamp(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);
        ChatMessageDTO messageDTO = convertToDTO(savedMessage);

        try {
            sendToConversation(conversationId, messageDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return messageDTO;
    }

    // === USER DATA METHODS ===

    private ChatMessageDTO convertToDTO(Message message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setConversationId(message.getConversationId());
        dto.setSenderId(message.getSenderId());
        dto.setContent(message.getContent());
        dto.setMessageType(message.getType());
        dto.setStatus(message.getStatus().toString());
        dto.setTimestamp(message.getTimestamp());

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

    public void addSessionToConversation(Long conversationId, String sessionId, WebSocketSession session) {
        conversationSessions.computeIfAbsent(conversationId, k -> new ConcurrentHashMap<>())
                .put(sessionId, session);
    }

    public void removeSessionFromConversation(Long conversationId, String sessionId, WebSocketSession session) {
        conversationSessions.computeIfAbsent(conversationId, k -> new ConcurrentHashMap<>())
                .remove(sessionId, session);
    }

    public void removeSessionFromConversation(Long conversationId, String sessionId) {
        if (conversationSessions.containsKey(conversationId)) {
            conversationSessions.get(conversationId).remove(sessionId);

            if (conversationSessions.get(conversationId).isEmpty()) {
                conversationSessions.remove(conversationId);
            }
        }
    }
}