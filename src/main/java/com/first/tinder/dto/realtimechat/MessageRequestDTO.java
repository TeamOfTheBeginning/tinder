package com.first.tinder.dto.realtimechat;

import lombok.*;

@NoArgsConstructor(force = true)
@AllArgsConstructor
@Getter
@Builder
public class MessageRequestDTO {
    private final String content;
}
