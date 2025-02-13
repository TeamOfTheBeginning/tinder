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

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, String> sessionNicknames = new ConcurrentHashMap<>();

    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {
        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String nickname = accessor.getFirstNativeHeader("nickname");

        if (nickname == null || nickname.trim().isEmpty()) {
            log.warn("Nickname is missing in CONNECT headers.");
            nickname = "Guest_" + accessor.getSessionId();
        }

        String sessionId = accessor.getSessionId();
        sessionNicknames.put(sessionId, nickname);

        if (accessor.getSessionAttributes() != null) {
            accessor.getSessionAttributes().put("nickname", nickname);
        } else {
            log.error("Session attributes are null! Cannot store nickname.");
        }

        log.info("[SessionConnected]: sessionId = " + sessionId + ", nickname = " + nickname);

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
        String sessionId = SimpMessageHeaderAccessor.wrap(event.getMessage()).getSessionId();
        String nickname = sessionNicknames.remove(sessionId);

        if (nickname == null) {
            nickname = "Unknown User";
        }

        log.info("[SessionDisconnected]: sessionId = " + sessionId + ", nickname = " + nickname);

        MessageResponseDTO responsedto = MessageResponseDTO.builder()
                .type(MessageType.SYSTEM)
                .sessionId(sessionId)
                .nickname(nickname)
                .content(nickname + "님이 나갔습니다.")
                .build();

        messagingTemplate.convertAndSend("/topic/real_chat", responsedto);
    }
}
