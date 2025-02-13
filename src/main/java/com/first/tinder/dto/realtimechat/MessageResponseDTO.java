package com.first.tinder.dto.realtimechat;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.first.tinder.common.enums.MessageType;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MessageResponseDTO {
    @JsonProperty("type")
    private MessageType type;

    @JsonProperty("content")
    private String content;

    @JsonProperty("sessionId")
    private String sessionId;

    @JsonProperty("nickname")
    private String nickname;
}
