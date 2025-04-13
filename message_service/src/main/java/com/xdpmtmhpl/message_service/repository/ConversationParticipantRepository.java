package com.xdpmtmhpl.message_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xdpmtmhpl.message_service.models.ConversationParticipant;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, Long> {
    List<ConversationParticipant> findByUserId(Long userId);

    List<ConversationParticipant> findByConversationId(Long conversationId);

    Optional<ConversationParticipant> findByConversationIdAndUserId(Long conversationId, Long userId);
}