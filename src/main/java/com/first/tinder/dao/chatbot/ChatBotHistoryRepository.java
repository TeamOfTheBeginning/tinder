package com.first.tinder.dao.chatbot;

import com.first.tinder.entity.chatbot.ChatBotHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatBotHistoryRepository extends JpaRepository<ChatBotHistory, Long> {
    List<ChatBotHistory> findByUserIdOrderByTimestampAsc(String userId);
}
