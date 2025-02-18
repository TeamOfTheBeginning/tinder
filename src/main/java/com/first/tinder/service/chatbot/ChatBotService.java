package com.first.tinder.service.chatbot;

import com.first.tinder.dto.chatbot.ChatBotRequest;
import com.first.tinder.dto.chatbot.ChatBotResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatBotService {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    public ChatBotResponse getChatBotResponse(ChatBotRequest request) {
        RestTemplate restTemplate = new RestTemplate();

        // OpenAI 요청 데이터 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4");
        requestBody.put("messages", Collections.singletonList(Map.of("role", "user", "content", request.getMessage())));
        requestBody.put("max_tokens", 100);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + openAiApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                OPENAI_API_URL, HttpMethod.POST, entity, Map.class
        );

        // 응답에서 "choices"를 List<Map> 형태로 가져오기
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");

        // 첫 번째 응답에서 "message" 안의 "content" 가져오기
        Map<String, Object> firstChoice = choices.get(0);
        Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
        String botResponse = (String) message.get("content");

        return new ChatBotResponse(botResponse);
    }
}
