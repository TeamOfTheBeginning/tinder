package com.first.tinder.dto.realtimechat;

import com.first.tinder.common.enums.MessageType;
import lombok.*;

@NoArgsConstructor(force = true)
@AllArgsConstructor
@Getter
@Builder
public class MessageResponseDTO {
    private final MessageType type;
    private final Long roomId;
    private final String content;
    private final String sessionId;
    private final String nickname;
    private final String profileImg;
}
