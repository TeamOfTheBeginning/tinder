package com.first.tinder.dto;

import com.first.tinder.entity.Quiz;
import lombok.Getter;

@Getter
public class QuizDTO {
    private int quizId;
    private String content;
    private long releaseTime;

    public QuizDTO(Quiz quiz, long releaseTime) {
        this.quizId = quiz.getQuizId();
        this.content = quiz.getContent();
        this.releaseTime = releaseTime;
    }
}
