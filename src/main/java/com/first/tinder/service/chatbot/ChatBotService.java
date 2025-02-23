package com.first.tinder.service.chatbot;

import com.first.tinder.dao.chatbot.ChatBotHistoryRepository;
import com.first.tinder.dto.chatbot.ChatBotRequest;
import com.first.tinder.dto.chatbot.ChatBotResponse;
import com.first.tinder.entity.chatbot.ChatBotHistory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatBotService {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    private final RestTemplate restTemplate;
    private final WorldInfoService worldInfoService;
    private final ChatBotHistoryRepository chatbotHistoryRepository;
    private final NewsService newsService;
    private final MusicService musicService;

    public ChatBotService(RestTemplate restTemplate, WorldInfoService worldInfoService, ChatBotHistoryRepository chatbotHistoryRepository, NewsService newsService, MusicService musicService) {
        this.restTemplate = restTemplate;
        this.worldInfoService = worldInfoService;
        this.chatbotHistoryRepository = chatbotHistoryRepository;
        this.newsService = newsService;
        this.musicService = musicService;
    }

    private static final Logger logger = LoggerFactory.getLogger(ChatBotService.class);

    public ChatBotResponse getChatBotResponse(String userId, ChatBotRequest request) {
        String userMessage = request.getMessage().toLowerCase();

        saveChatHistory(userId, "user", userMessage);

        List<ChatBotHistory> chatHistories = chatbotHistoryRepository.findByUserIdOrderByTimestampAsc(userId);
        logger.info("새로운 대화 기록 개수: {}", chatHistories.size());
        if (chatHistories.size() > 10) {
            chatHistories = chatHistories.subList(chatHistories.size() - 10, chatHistories.size());
        }

        List<Map<String, String>> messages = new ArrayList<>();
        for (ChatBotHistory chat : chatHistories) {
            messages.add(Map.of("role", chat.getRole(), "content", chat.getContent()));
        }

        if (userMessage.contains("뉴스") || userMessage.contains("최신 뉴스")) {
            String news = newsService.getLatestNews();
            return saveAndReturnResponse(userId, userMessage, news);
        }

        if (userMessage.contains("노래") || userMessage.contains("음악")) {
            if (userMessage.contains("최신") && userMessage.contains("한국")) {
                String music = musicService.getLatestKoreanMusic();
                return saveAndReturnResponse(userId, userMessage, music);
            } else if (userMessage.contains("최신")) {
                String music = musicService.getLatestMusic();
                return saveAndReturnResponse(userId, userMessage, music);
            } else if (userMessage.contains("기쁠때") || userMessage.contains("행복할때")) {
                String music = musicService.getMusicByMood("happy");
                return saveAndReturnResponse(userId, userMessage, music);
            } else if (userMessage.contains("우울할때") || userMessage.contains("슬플때")) {
                String music = musicService.getMusicByMood("sad");
                return saveAndReturnResponse(userId, userMessage, music);
            } else if (userMessage.contains("로맨틱") || userMessage.contains("데이트")) {
                String music = musicService.getMusicByMood("romantic");
                return saveAndReturnResponse(userId, userMessage, music);
            }
        }

        if (userMessage.contains("시간") || userMessage.contains("몇 시")) {
            String city = extractCity(userMessage);
            if (!city.isEmpty()) {
                String time = worldInfoService.getTimeByCity(city);
                return saveAndReturnResponse(userId, userMessage, time);
            } else {
                return saveAndReturnResponse(userId, userMessage, "어느 도시의 시간을 원하시나요?");
            }
        }

        if (userMessage.contains("날씨") || userMessage.contains("기온")) {
            String city = extractCity(userMessage);
            if (!city.isEmpty()) {
                String weather = worldInfoService.getWeatherByCity(city);
                return saveAndReturnResponse(userId, userMessage, weather);
            } else {
                return saveAndReturnResponse(userId, userMessage, "어느 도시의 날씨를 원하시나요?");
            }
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiApiKey);

            messages.add(Map.of("role", "user", "content", request.getMessage()));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4o");
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.5);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(OPENAI_API_URL, HttpMethod.POST, entity, Map.class);

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
        saveChatHistory(userId, "assistant", botResponse);
        return new ChatBotResponse(botResponse);
    }

    private void saveChatHistory(String userId, String role, String content) {
        ChatBotHistory chatHistory = ChatBotHistory.builder()
                .userId(userId)
                .role(role)
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();
        chatbotHistoryRepository.save(chatHistory);
    }

    private String extractCity(String message) {
        Map<String, String> cityMappings = Map.of(
                "한국", "서울",
                "미국", "뉴욕",
                "영국", "런던",
                "일본", "도쿄",
                "독일", "베를린",
                "프랑스", "파리",
                "호주", "시드니",
                "중국", "베이징",
                "러시아", "모스크바"
        );

        List<String> knownCities = List.of("서울", "뉴욕", "런던", "도쿄", "베를린", "파리", "시드니", "로스앤젤레스", "베이징", "모스크바");

        for (String country : cityMappings.keySet()) {
            if (message.contains(country)) {
                return cityMappings.get(country);
            }
        }

        for (String city : knownCities) {
            if (message.contains(city)) {
                return city;
            }
        }

        return "";
    }
}
