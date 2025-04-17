package com.xdpmtmhpl.message_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.xdpmtmhpl.message_service.models.Message;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationIdOrderByTimestampDesc(Long conversationId);

    List<Message> findByConversationIdOrderByTimestampAsc(Long conversationId);

    List<Message> findTopByConversationIdOrderByTimestampDesc(Long conversationId);

    @Query("SELECT m FROM Message m WHERE m.conversationId = :conversationId ORDER BY m.timestamp DESC LIMIT 1")
    Message findLastMessageByConversationId(@Param("conversationId") Long conversationId);

}