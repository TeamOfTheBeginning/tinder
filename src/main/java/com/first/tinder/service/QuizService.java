package com.first.tinder.service;

import com.first.tinder.dao.*;
import com.first.tinder.dto.QuizStatisticsDTO;
import com.first.tinder.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class QuizService {

    @Autowired
    MemberRepository mr;

    @Autowired
    ChatGroupRepository cgr;

    @Autowired
    ChatGroupQuizRepository cgqr;

    @Autowired
    QuizRepository quizRepository;

    @Autowired
    ChatGroupQuizAnswerRepository cgqar;

    public List<ChatGroupQuiz> getQuizList(int chatGroupId) {

        ChatGroup chatGroup = cgr.findByChatGroupId(chatGroupId)
                .orElse(new ChatGroup()); // 찾지 못했을 경우 기본 ChatGroup 생성

        List<ChatGroupQuiz> chatGroupQuizList = new ArrayList<>();
        chatGroupQuizList = cgqr.findAllByChatGroup(chatGroup);

        return chatGroupQuizList;
    }

    public void insertQuizAnswer(int chatGroupQuizId, int memberId, int answer) {
        Member member = mr.findById(memberId)
                .orElse(new Member());
        System.out.println("member"+member);

        ChatGroupQuiz chatGroupQuiz = cgqr.findById(chatGroupQuizId)
                .orElse(new ChatGroupQuiz());
        System.out.println("chatGroupQuiz"+chatGroupQuiz);

        ChatGroupQuizAnswer chatGroupQuizAnswer = new ChatGroupQuizAnswer();
        chatGroupQuizAnswer.setMember(member);
        chatGroupQuizAnswer.setAnswer(answer);
        chatGroupQuizAnswer.setChatGroupQuiz(chatGroupQuiz);
        cgqar.save(chatGroupQuizAnswer);
    }


    public boolean guessTheAnswer(int chatGroupQuizId, int memberId, int answer) {

        Member member = mr.findById(memberId)
                .orElse(new Member());

        ChatGroupQuiz chatGroupQuiz = cgqr.findById(chatGroupQuizId)
                .orElse(new ChatGroupQuiz());

        List<ChatGroupQuizAnswer> chatGroupQuizAnswers = cgqar.findAllByChatGroupQuiz(chatGroupQuiz);

        int opponentAnswer = 0;

        for(ChatGroupQuizAnswer chatGroupQuizAnswer : chatGroupQuizAnswers){
            if(!chatGroupQuizAnswer.getMember().equals(member)){
                opponentAnswer = chatGroupQuizAnswer.getAnswer();
            }
        }

        System.out.println("opponentAnswer"+opponentAnswer);

        return isSameAnswer(opponentAnswer, answer);
    }


    public boolean isSameAnswer(int opponentAnswer, int answer) {
        return opponentAnswer == answer;
    }

    public QuizStatisticsDTO getStatistics() {
        Quiz quiz = new Quiz();
        Double ratio = 0.0;

        List<Object[]> result = cgqar.getRandomQuizAnswerStatistics();
        if (!result.isEmpty()) {
            Object[] row = result.get(0);
            quiz = (Quiz) row[0];
            ratio = (Double) row[1];

            System.out.println("Random Quiz: " + quiz.getContent() + ", 1의 비율: " + ratio);
        }

        QuizStatisticsDTO quizStatisticsDto = new QuizStatisticsDTO(quiz,ratio);

        System.out.println(quizStatisticsDto);

        return quizStatisticsDto;
    }
}
