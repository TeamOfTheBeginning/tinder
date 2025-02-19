package com.first.tinder.service.chatbot;

import com.first.tinder.dto.chatbot.ChatBotRequest;
import com.first.tinder.dto.chatbot.ChatBotResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class ChatBotService {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    private final RestTemplate restTemplate;

    // RestTemplate을 생성자 주입 방식으로 관리
    public ChatBotService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ChatBotResponse getChatBotResponse(ChatBotRequest request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4o");
            requestBody.put("messages", List.of(
                    Map.of("role", "user", "content", request.getMessage())
            ));
            requestBody.put("temperature", 0.5);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    OPENAI_API_URL, HttpMethod.POST, entity, Map.class
            );

            // 응답 데이터가 올바르게 왔는지 검증 후 처리
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    String chatbotMessage = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");
                    return new ChatBotResponse(chatbotMessage);
                }
            }
            return new ChatBotResponse("죄송합니다. 응답을 처리할 수 없습니다.");
        } catch (Exception e) {
            return new ChatBotResponse("챗봇 서비스에 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    }
}
