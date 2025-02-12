package com.first.tinder.dao;

import com.first.tinder.entity.ChatGroup;
import com.first.tinder.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatGroupRepository extends JpaRepository<ChatGroup, Integer> {
    Optional<ChatGroup> findByChatGroupId(int chatGroupId);
}
