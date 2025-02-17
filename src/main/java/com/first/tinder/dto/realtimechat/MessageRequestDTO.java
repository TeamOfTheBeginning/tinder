package com.first.tinder.dto.realtimechat;

import lombok.*;

@NoArgsConstructor(force = true)
@AllArgsConstructor
@Getter
@Builder
public class MessageRequestDTO {
    private final Long roomId;
    private final String content;
    private final String nickname;
}
