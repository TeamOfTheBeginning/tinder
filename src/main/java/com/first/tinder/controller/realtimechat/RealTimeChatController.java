package com.first.tinder.controller.realtimechat;

import com.first.tinder.dto.realtimechat.MessageRequestDTO;
import com.first.tinder.dto.realtimechat.MessageResponseDTO;
import com.first.tinder.service.realtimechat.RealTimeChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class RealTimeChatController {

    private final RealTimeChatService realtimechatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/real_chat")
    public void sendChatMessage(MessageRequestDTO requestdto, SimpMessageHeaderAccessor accessor) {
        if (requestdto == null || requestdto.getContent().trim().isEmpty()) {
            log.warn("Invalid chat message received: {}", requestdto);
            return;
        }

        String sessionId = accessor.getSessionId();
        String nickname = (String) accessor.getSessionAttributes().getOrDefault("nickname", "익명");

        log.info("[ChatMessage]: sessionId = {}, nickname = {}, content = {}", sessionId, nickname, requestdto.getContent());

        MessageResponseDTO response = realtimechatService.processMessage(requestdto, sessionId, nickname);

        messagingTemplate.convertAndSend("/topic/real_chat", response);
    }
}
