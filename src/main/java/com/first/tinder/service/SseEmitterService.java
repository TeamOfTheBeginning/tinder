package com.first.tinder.service;

import com.first.tinder.entity.Notification;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class SseEmitterService {
    private final Map<Integer, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final Map<Integer, Queue<String>> notificationQueue = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Integer memberId) {
        SseEmitter emitter = new SseEmitter(60 * 1000L); // 10초 동안 연결 유지
        emitters.put(memberId, emitter);

        // 이전에 밀린 알림이 있으면 전송
        Queue<String> notifications = notificationQueue.get(memberId);
        if (notifications != null) {
            while (!notifications.isEmpty()) {
                try {
                    emitter.send(SseEmitter.event().name("notification").data(notifications.poll()));
                } catch (IOException e) {
                    emitter.completeWithError(e);
                    break;
                }
            }
        }

        // 알림이 완료되면 연결된 emitter 삭제
        emitter.onCompletion(() -> emitters.remove(memberId));
        emitter.onTimeout(() -> emitters.remove(memberId));

        return emitter;
    }

    public void sendNotification(Integer memberId, String message, Notification afternotification) {
        HashMap<String,Object> result = new HashMap<>();
//        result.put("memberId", memberId);
//        result.put("message", message);
        result.put("notification", afternotification);


        SseEmitter emitter = emitters.get(memberId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("notification")
                        .data(result));
            } catch (IOException e) {
                // 연결 실패 시, 밀린 알림을 큐에 저장
                notificationQueue
                        .computeIfAbsent(memberId, k -> new LinkedList<>())
                        .offer(message);
                emitters.remove(memberId);
            }
        }else {
            // 연결이 없으면, 알림을 큐에 저장
            notificationQueue
                    .computeIfAbsent(memberId, k -> new LinkedList<>())
                    .offer(message);
        }
    }
}

