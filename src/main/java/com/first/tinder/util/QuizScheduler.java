package com.first.tinder.util;

import com.first.tinder.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import jakarta.annotation.PostConstruct;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class QuizScheduler {
    private final QuizService quizService;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final Random random = new Random();

//    @PostConstruct
//    public void startQuizScheduler() {
//        scheduleNextQuiz();
//    }
//
//    private void scheduleNextQuiz() {
//        long delay = random.nextInt(10800) + 1; // 1초 ~ 10800초(3시간) 사이 랜덤
//        scheduler.schedule(() -> {
//            quizService.generateRandomQuiz();
//            scheduleNextQuiz(); // 다음 퀴즈 출제 예약
//        }, delay, TimeUnit.SECONDS);
//    }
}
