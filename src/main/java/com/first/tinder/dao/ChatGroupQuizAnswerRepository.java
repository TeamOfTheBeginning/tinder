package com.first.tinder.dao;

import com.first.tinder.entity.ChatGroupQuiz;
import com.first.tinder.entity.ChatGroupQuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatGroupQuizAnswerRepository extends JpaRepository<ChatGroupQuizAnswer,Integer> {
    List<ChatGroupQuizAnswer> findAllByChatGroupQuiz(ChatGroupQuiz chatGroupQuiz);
}
