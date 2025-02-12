package com.first.tinder.dao;

import com.first.tinder.entity.Chat;
import com.first.tinder.entity.ChatGroup;
import com.first.tinder.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Integer> {
    List<Chat> findByChatGroup(ChatGroup c);
}
