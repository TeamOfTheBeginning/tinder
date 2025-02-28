package com.first.tinder.dto;

import com.first.tinder.entity.Quiz;
import lombok.Getter;

@Getter
public class QuizStatisticsDTO {
    private int quizId;
    private String content;
    private Double ratio;

//    public QuizStatisticsDTO(Quiz quiz, Double ratio) {
//        this.quizId = quiz.getQuizId();
//        this.content = quiz.getContent();
//        this.ratio = ratio;
//    }

    public QuizStatisticsDTO(Quiz quiz, Double ratio) {
        this.quizId = quiz.getQuizId();
        this.content = quiz.getContent();
        this.ratio = ratio;
    }
}
