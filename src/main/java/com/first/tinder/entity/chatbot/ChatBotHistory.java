package com.first.tinder.entity.chatbot;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatBotHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    private String role; // "user" 또는 "assistant"

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime timestamp;
}
