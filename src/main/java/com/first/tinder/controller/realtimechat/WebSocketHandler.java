package com.first.tinder.controller.realtimechat;

import com.first.tinder.controller.realtimechat.RealTimeChatMemberController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.first.tinder.common.enums.MessageType;
import com.first.tinder.dto.realtimechat.MessageResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
//    private final Map<Long, Set<String>> roomUsers = new ConcurrentHashMap<>();

    private final Map<Long, CopyOnWriteArraySet<String>> roomUsers = new ConcurrentHashMap<>();


    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {
        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        String nickname = accessor.getFirstNativeHeader("nickname");
        String roomIdHeader = accessor.getFirstNativeHeader("roomId");

        if (nickname == null || nickname.trim().isEmpty()) {
            nickname = "Guest_" + sessionId;
        }

        if (roomIdHeader == null || roomIdHeader.trim().isEmpty()) {
//            log.error("🚨 roomIdHeader가 존재하지 않음!");
            return;
        }

        Long roomId = Long.valueOf(roomIdHeader);
        accessor.getSessionAttributes().put("nickname", nickname);
        accessor.getSessionAttributes().put("roomId", roomId);

        RealTimeChatMemberController.updateRoomUsers(roomId, nickname, true);

        roomUsers.computeIfAbsent(roomId, k -> new CopyOnWriteArraySet<>()).add(nickname);
        Set<String> users = roomUsers.get(roomId);

//        log.info("✅ [{}] {}님이 입장! 현재 접속 인원: {}", roomId, nickname, users.size());

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonUserList = objectMapper.writeValueAsString(new ArrayList<>(users));

            // ✅ 모든 사용자에게 접속자 목록 업데이트
            messagingTemplate.convertAndSend("/topic/chatroom/" + roomId + "/users", jsonUserList);

            // ✅ 새로운 사용자에게 기존 접속자 목록 개별 전송
            messagingTemplate.convertAndSendToUser(sessionId, "/topic/chatroom/users", jsonUserList);
        } catch (JsonProcessingException e) {
//            log.error("🚨 사용자 목록 JSON 변환 오류 (입장): ", e);
        }

        // ✅ 채팅방 내 시스템 메시지 전송
        MessageResponseDTO responseDto = MessageResponseDTO.builder()
                .type(MessageType.SYSTEM)
                .sessionId(sessionId)
                .nickname(nickname)
                .content(nickname + "님이 참가하였습니다.")
                .build();
        messagingTemplate.convertAndSend("/topic/real_chat/" + roomId, responseDto);
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        String nickname = (String) accessor.getSessionAttributes().getOrDefault("nickname", "Unknown User");
        Long roomId = (Long) accessor.getSessionAttributes().getOrDefault("roomId", -1L);

        if (roomId == -1L) {
//            log.warn("🚨 방 정보를 찾을 수 없습니다. sessionId: {}", sessionId);
            return;
        }

        Set<String> users = roomUsers.get(roomId);
        if (users != null) {
            users.remove(nickname);
            if (users.isEmpty()) {
                roomUsers.remove(roomId);
            }
        }

//        log.info("❌ [{}] {}님이 퇴장! 현재 접속 인원: {}", roomId, nickname, users != null ? users.size() : 0);

        // ✅ 현재 채팅방 사용자 목록 JSON 변환 후 전송 (추가된 코드)
        try {
            String jsonUserList = new ObjectMapper().writeValueAsString(users);
//            log.info("🚀 JSON 변환된 사용자 목록 (퇴장): {}", jsonUserList);
            messagingTemplate.convertAndSend("/topic/chatroom/" + roomId + "/users", jsonUserList);
        } catch (JsonProcessingException e) {
//            log.error("🚨 사용자 목록 JSON 변환 오류 (퇴장): ", e);
        }

        // ✅ 현재 채팅방 사용자 목록 전송
        messagingTemplate.convertAndSend("/topic/chatroom/" + roomId + "/users", users);

        RealTimeChatMemberController.updateRoomUsers(roomId, nickname, false);
    // ✅ 채팅방 내 시스템 메시지 전송
        MessageResponseDTO responseDto = MessageResponseDTO.builder()
                .type(MessageType.SYSTEM)
                .sessionId(sessionId)
                .nickname(nickname)
                .content(nickname + "님이 나갔습니다.")
                .build();
        messagingTemplate.convertAndSend("/topic/real_chat/" + roomId, responseDto);
    }



    @GetMapping("/api/realtime-chatrooms/{roomId}/users")
    public ResponseEntity<Set<String>> getChatRoomUsers(@PathVariable Long roomId) {
        Set<String> users = roomUsers.getOrDefault(roomId, new CopyOnWriteArraySet<>());
        return ResponseEntity.ok(users);
    }

    @Scheduled(fixedRate = 1000) // 1초마다 실행
    public void broadcastUserList() {
        for (Map.Entry<Long, CopyOnWriteArraySet<String>> entry : roomUsers.entrySet()) {
            Long roomId = entry.getKey();
            CopyOnWriteArraySet<String> users = entry.getValue();

            try {
                String jsonUserList = new ObjectMapper().writeValueAsString(users);

                // 🔥 변경된 경우에만 전송 (기존 상태와 비교)
                if (!jsonUserList.equals(lastUserList.get(roomId))) {
//                    log.info("🚀 [주기적 업데이트] 채팅방 [{}] 사용자 목록 변경 감지: {}", roomId, jsonUserList);
                    messagingTemplate.convertAndSend("/topic/chatroom/" + roomId + "/users", jsonUserList);
                    lastUserList.put(roomId, jsonUserList); // 최신 상태 저장
                }
            } catch (JsonProcessingException e) {
//                log.error("🚨 사용자 목록 JSON 변환 오류 (주기적 업데이트): ", e);
            }
        }
    }

    // 마지막 전송한 사용자 목록을 저장하여 비교 (불필요한 중복 전송 방지)
    private final Map<Long, String> lastUserList = new ConcurrentHashMap<>();
}
