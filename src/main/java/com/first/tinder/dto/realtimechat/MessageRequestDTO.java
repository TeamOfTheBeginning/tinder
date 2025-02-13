package com.first.tinder.dto.realtimechat;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MessageRequestDTO {
    @JsonProperty("content")
    private String content;
}
