package com.first.tinder.controller.realtimechat;

import com.first.tinder.common.enums.MessageType;
import com.first.tinder.dto.realtimechat.MessageResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {
        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        String nickname = accessor.getFirstNativeHeader("nickname");
        nickname = (nickname == null || nickname.trim().isEmpty()) ? "Guest_" + sessionId : nickname;

        if (accessor.getSessionAttributes() == null) {
            accessor.setSessionAttributes(new ConcurrentHashMap<>());
        }
        accessor.getSessionAttributes().put("nickname", nickname);

        log.info("[SessionConnected]: sessionId = {}, nickname = {}", sessionId, nickname);

        MessageResponseDTO responsedto = MessageResponseDTO.builder()
                .type(MessageType.SYSTEM)
                .sessionId(sessionId)
                .nickname(nickname)
                .content(nickname + "님이 참가하였습니다.")
                .build();

        messagingTemplate.convertAndSend("/topic/real_chat", responsedto);
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        String nickname = (String) accessor.getSessionAttributes().getOrDefault("nickname", "Unknown User");

        log.info("[SessionDisconnected]: sessionId = {}, nickname = {}", sessionId, nickname);

        MessageResponseDTO responsedto = MessageResponseDTO.builder()
                .type(MessageType.SYSTEM)
                .sessionId(sessionId)
                .nickname(nickname)
                .content(nickname + "님이 나갔습니다.")
                .build();

        messagingTemplate.convertAndSend("/topic/real_chat", responsedto);
    }
}
