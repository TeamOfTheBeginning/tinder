package com.first.tinder.dao;

import com.first.tinder.entity.ChatGroupQuiz;
import com.first.tinder.entity.ChatGroupQuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatGroupQuizAnswerRepository extends JpaRepository<ChatGroupQuizAnswer,Integer> {
    List<ChatGroupQuizAnswer> findAllByChatGroupQuiz(ChatGroupQuiz chatGroupQuiz);

    @Query("SELECT cq.chatGroupQuiz.quiz, " +
            "SUM(CASE WHEN cq.answer = 1 THEN 1 ELSE 0 END) * 1.0 / COUNT(cq) " +
            "FROM ChatGroupQuizAnswer cq " +
            "GROUP BY cq.chatGroupQuiz.quiz " +
            "ORDER BY FUNCTION('RAND') " + // 랜덤 정렬
            "LIMIT 1")
    List<Object[]> getRandomQuizAnswerStatistics();
}
