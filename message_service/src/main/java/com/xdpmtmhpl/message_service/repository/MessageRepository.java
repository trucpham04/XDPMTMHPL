package com.xdpmtmhpl.message_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xdpmtmhpl.message_service.models.Message;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationIdOrderByTimestampDesc(Long conversationId);

    List<Message> findTopByConversationIdOrderByTimestampDesc(Long conversationId);
}