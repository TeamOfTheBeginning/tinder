package com.first.tinder.controller.chatbot;

import com.first.tinder.dto.chatbot.ChatBotRequest;
import com.first.tinder.dto.chatbot.ChatBotResponse;
import com.first.tinder.entity.chatbot.ChatBotHistory;
import com.first.tinder.service.chatbot.ChatBotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000") // React와 연동 시 CORS 문제 해결
public class ChatBotController {

    private final ChatBotService chatBotService;

    public ChatBotController(ChatBotService chatBotService) {
        this.chatBotService = chatBotService;
    }

    @PostMapping("/ask/{userId}")
    public ChatBotResponse askChatBot(@PathVariable String userId, @RequestBody ChatBotRequest request) {
        return chatBotService.getChatBotResponse(userId, request);
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ChatBotHistory>> getChatHistory(@PathVariable String userId) {
        List<ChatBotHistory> history = chatBotService.getChatHistoryByUserId(userId);
        if (history.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(history);
    }
}
