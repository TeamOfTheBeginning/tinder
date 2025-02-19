package com.first.tinder.controller.chatbot;

import com.first.tinder.dto.chatbot.ChatBotRequest;
import com.first.tinder.dto.chatbot.ChatBotResponse;
import com.first.tinder.service.chatbot.ChatBotService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000") // React와 연동 시 CORS 문제 해결
public class ChatBotController {

    private final ChatBotService chatBotService;

    public ChatBotController(ChatBotService chatBotService) {
        this.chatBotService = chatBotService;
    }

    @PostMapping("/ask")
    public ChatBotResponse askChatBot(@RequestBody ChatBotRequest request) {
        return chatBotService.getChatBotResponse(request);
    }
}