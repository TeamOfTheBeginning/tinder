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
    private final WorldInfoService worldInfoService;

    // 사용자별 대화 기록을 저장하는 Map
    private static final Map<String, List<Map<String, String>>> chatHistory = new HashMap<>();

    public ChatBotService(RestTemplate restTemplate, WorldInfoService worldInfoService) {
        this.restTemplate = restTemplate;
        this.worldInfoService = worldInfoService;
    }

    public ChatBotResponse getChatBotResponse(String userId, ChatBotRequest request) {
        String userMessage = request.getMessage().toLowerCase();

        // 사용자의 이전 대화 이력 가져오기 (없으면 새로 생성)
        chatHistory.putIfAbsent(userId, new ArrayList<>());
        List<Map<String, String>> messages = chatHistory.get(userId);

        // 1. 특정 키워드(날씨, 시간) 처리
        if (userMessage.contains("시간") || userMessage.contains("몇 시")) {
            String city = extractCity(userMessage);
            if (!city.isEmpty()) {
                String time = worldInfoService.getTimeByCity(city);
                return saveAndReturnResponse(userId, userMessage, city + "의 현재 시간은 " + time + "입니다.");
            }
        }

        if (userMessage.contains("날씨") || userMessage.contains("기온")) {
            String city = extractCity(userMessage);
            if (!city.isEmpty()) {
                String weather = worldInfoService.getWeatherByCity(city);
                return saveAndReturnResponse(userId, userMessage, weather);
            }
        }

        // 2. OpenAI API 요청을 위한 설정
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiApiKey);

            // OpenAI API에 전달할 messages 리스트
            List<Map<String, String>> openAiMessages = new ArrayList<>(messages);
            openAiMessages.add(Map.of("role", "user", "content", request.getMessage()));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4o");
            requestBody.put("messages", openAiMessages); // 대화 기록 포함
            requestBody.put("temperature", 0.5);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(OPENAI_API_URL, HttpMethod.POST, entity, Map.class);

            // OpenAI 응답 처리
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    String chatbotMessage = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");
                    return saveAndReturnResponse(userId, userMessage, chatbotMessage);
                }
            }
            return new ChatBotResponse("죄송합니다. 요청을 처리할 수 없습니다.");
        } catch (Exception e) {
            return new ChatBotResponse("챗봇 서비스에 오류가 발생했습니다.");
        }
    }

    private ChatBotResponse saveAndReturnResponse(String userId, String userMessage, String botResponse) {
        // 대화 기록 저장
        List<Map<String, String>> messages = chatHistory.get(userId);
        messages.add(Map.of("role", "user", "content", userMessage));
        messages.add(Map.of("role", "assistant", "content", botResponse));

        // 최근 대화 10개까지만 유지
        if (messages.size() > 20) {
            messages.subList(0, messages.size() - 20).clear();
        }

        return new ChatBotResponse(botResponse);
    }

    private String extractCity(String message) {
        List<String> knownCities = List.of("서울", "뉴욕", "런던", "도쿄", "베를린");
        for (String city : knownCities) {
            if (message.contains(city)) {
                return city;
            }
        }
        return "";
    }
}
