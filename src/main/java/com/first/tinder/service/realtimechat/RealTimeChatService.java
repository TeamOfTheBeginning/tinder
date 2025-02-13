package com.first.tinder.service.realtimechat;

import com.first.tinder.dto.realtimechat.MessageRequestDTO;
import com.first.tinder.dto.realtimechat.MessageResponseDTO;

public interface RealTimeChatService {
    MessageResponseDTO processMessage(MessageRequestDTO requestdto, String sessionId, String nickname);
}
