package com.first.tinder.dao;

import com.first.tinder.entity.ChatGroup;
import com.first.tinder.entity.ChatGroupQuiz;
import com.first.tinder.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatGroupQuizRepository extends JpaRepository<ChatGroupQuiz, Integer> {
    List<ChatGroupQuiz> findAllByChatGroup(ChatGroup chatGroup);
}
