package com.first.tinder.controller;

import com.first.tinder.dto.QuizDTO;
import com.first.tinder.entity.ChatGroupQuiz;
import com.first.tinder.entity.Quiz;
import com.first.tinder.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/quiz")
public class QuizController {

    @Autowired
    QuizService qs;

    @GetMapping("/getQuizList")
    public HashMap<String,Object> getQuizList(@RequestParam("chatGroupId") int chatGroupId) {
        HashMap<String,Object> result = new HashMap<>();
        List<ChatGroupQuiz> chatGroupQuizList = qs.getQuizList(chatGroupId);

        System.out.println("chatGroupQuizList"+chatGroupQuizList);
        result.put("chatGroupQuizList",chatGroupQuizList);
        return result;
    }

    @PostMapping("/submitAnswer")
    public ResponseEntity<?> submitAnswer(@RequestParam("chatGroupQuizId") int chatGroupQuizId,@RequestParam("memberId") int memberId,@RequestParam("answer") int answer) {
        System.out.println("chatGroupQuizId"+chatGroupQuizId);
        System.out.println("memberId"+memberId);
        System.out.println("answer"+answer);

        qs.insertQuizAnswer(chatGroupQuizId,memberId,answer);

//        boolean isSameAnswer = qs.checkAnswers(request.getChatGroupId(), request.getAnswer());
//        return ResponseEntity.ok().body(Map.of("result", true ? "CONTINUE" : "END"));
        return ResponseEntity.ok().body(Map.of("result", "yes"));
    }

    @PostMapping("/guessTheAnswer")
    public ResponseEntity<?> guessTheAnswer(@RequestParam("chatGroupQuizId") int chatGroupQuizId,@RequestParam("memberId") int memberId,@RequestParam("answer") int answer){

        boolean isSameAnswer = qs.guessTheAnswer(chatGroupQuizId,memberId,answer);

        System.out.println("isSameAnswer"+isSameAnswer);

        return ResponseEntity.ok().body(Map.of("result", isSameAnswer ? "CONTINUE" : "END"));
    }

}
