package com.first.tinder.util;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SseEmitters {

    private final Map<Integer, SseEmitter> emitters = new ConcurrentHashMap<>();

    // 클라이언트가 SSE 연결을 요청하면 실행
    public SseEmitter addEmitter(Integer memberId) {
        SseEmitter emitter = new SseEmitter(60 * 1000L); // 1분 동안 연결 유지
        emitters.put(memberId, emitter);

        // 클라이언트가 연결을 종료하면 emitter 삭제
        emitter.onCompletion(() -> emitters.remove(memberId));
        emitter.onTimeout(() -> emitters.remove(memberId));

        return emitter;
    }

    // 특정 사용자에게 알림 전송
    public void sendNotification(Integer memberId, String message) {
        SseEmitter emitter = emitters.get(memberId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("notification")
                        .data(message));
            } catch (IOException e) {
                emitters.remove(memberId);
            }
        }
    }
}

