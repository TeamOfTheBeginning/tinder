package com.first.tinder.service.realtimechat;

import com.first.tinder.common.enums.MessageType;
import com.first.tinder.dto.realtimechat.MessageRequestDTO;
import com.first.tinder.dto.realtimechat.MessageResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class RealTimeChatServiceImpl implements RealTimeChatService {

    @Override
    public MessageResponseDTO processMessage(MessageRequestDTO requestdto, String sessionId, String nickname) {
        if (nickname == null) {
            nickname = "익명";
        }

        return MessageResponseDTO.builder()
                .type(MessageType.CHAT)
                .sessionId(sessionId)
                .nickname(nickname)
                .content(requestdto.getContent())
                .build();
    }
}
