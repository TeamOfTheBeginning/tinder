package com.first.tinder.controller.realtimechat;


import com.first.tinder.dto.realtimechat.MessageRequestDTO;
import com.first.tinder.dto.realtimechat.MessageResponseDTO;
import com.first.tinder.service.realtimechat.RealTimeChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequiredArgsConstructor
@Slf4j
public class RealTimeChatController {

    private final RealTimeChatService realtimechatService;
    private final Map<String, String> sessionNicknames = new ConcurrentHashMap<>();

    @MessageMapping("/real_chat")
    @SendTo("/topic/real_chat")
    public MessageResponseDTO sendChatMessage(MessageRequestDTO requestdto, SimpMessageHeaderAccessor accessor) {
        String sessionId = accessor.getSessionId();
        String nickname = (String) accessor.getSessionAttributes().get("nickname");

        if (nickname == null) {
            nickname = sessionNicknames.get(sessionId);
        }
        if (nickname == null) {
            nickname = "익명";
        }

        log.info("[ChatMessage]: sessionId = " + sessionId + ", nickname = " + nickname + ", content = " + requestdto.getContent());

        return realtimechatService.processMessage(requestdto, sessionId, nickname);
    }
}
