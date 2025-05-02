package com.xdpmtmhpl.message_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.xdpmtmhpl.message_service.models.Conversation;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    // Find conversations by participant user ID (through the join table)
    @Query("SELECT c FROM Conversation c JOIN c.participants p WHERE p.userId = :userId")
    List<Conversation> findByParticipantsUserId(@Param("userId") Long userId);
}
