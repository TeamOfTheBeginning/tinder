package com.first.tinder.service.chatbot;

import com.first.tinder.dao.MemberRepository;
import com.first.tinder.dao.chatbot.ChatBotHistoryRepository;
import com.first.tinder.dao.chatbot.JongroRestaurantRepository;
import com.first.tinder.dto.chatbot.ChatBotRequest;
import com.first.tinder.dto.chatbot.ChatBotResponse;
import com.first.tinder.entity.Member;
import com.first.tinder.entity.chatbot.ChatBotHistory;
import com.first.tinder.entity.chatbot.ChatJongroRestaurants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
    private final MemberRepository memberRepository;
    private final JongroRestaurantRepository jongroRestaurantRepository;

    public ChatBotService(RestTemplate restTemplate, WorldInfoService worldInfoService, ChatBotHistoryRepository chatbotHistoryRepository, NewsService newsService, MusicService musicService, MemberRepository memberRepository, JongroRestaurantRepository jongroRestaurantRepository) {
        this.restTemplate = restTemplate;
        this.worldInfoService = worldInfoService;
        this.chatbotHistoryRepository = chatbotHistoryRepository;
        this.newsService = newsService;
        this.musicService = musicService;
        this.memberRepository = memberRepository;
        this.jongroRestaurantRepository = jongroRestaurantRepository;
    }

    private static final Logger logger = LoggerFactory.getLogger(ChatBotService.class);

    private static final List<String> BUSINESS_TYPES = List.of(
            "감성주점", "경양식", "카페", "분식",
            "외국음식전문점(인도,태국등)", "일식",
            "중국식", "한식", "호프/통닭"
    );

    private String recommendMemberByAgeAndGender(int gender, int age) {
        List<Member> recommendedMembers = memberRepository.findEligibleMatches(
                gender, age - 3, age + 3
        );

        if (recommendedMembers.isEmpty()) {
            return "조건에 맞는 멤버가 없습니다.";
        }

        Collections.shuffle(recommendedMembers); // 셔플

        int limit = Math.min(3, recommendedMembers.size());
        List<Member> selectedMembers = recommendedMembers.subList(0, limit);

        StringBuilder recommendations = new StringBuilder("추천된 멤버 목록:\n");
        for (Member member : selectedMembers) {
            recommendations.append(String.format("닉네임: %s, 나이: %d, 지역: %s\n",
                    member.getNickname(), member.getAge(), member.getAddress()));
        }

        return recommendations.toString();
    }

    private int getAgeFromMessage(String message) {
        Pattern pattern = Pattern.compile("\\d+"); // 숫자 찾기
        Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            return Integer.parseInt(matcher.group()); // 첫 번째 숫자 반환
        }

        return -1; // 나이가 입력되지 않은 경우
    }

    private int getGenderFromMessage(String message) {
        if (message.contains("남성") || message.contains("남자")) {
            return 0; // 남성
        } else if (message.contains("여성") || message.contains("여자")) {
            return 1; // 여성
        }
        return -1; // 성별이 명확하지 않은 경우
    }

    public ChatBotResponse getChatBotResponse(String userId, ChatBotRequest request) {
        String userMessage = request.getMessage().toLowerCase();

        if (userMessage.contains("종로 맛집")) {
            return new ChatBotResponse("어떤 종류의 음식을 원하시나요? \n" + String.join(", ", BUSINESS_TYPES));
        }

        saveChatHistory(userId, "user", userMessage);

        Map<String, String> predefinedResponses = Map.of(
                "조언받기", "연애 조언이 필요하신가요? 프로필 작성 팁이나 첫 데이트 아이디어를 드릴 수 있어요!",
                "친구찾기", "추천받고 싶은 성별과 나이를 입력해주세요! \n (예: 23살 여성 멤버 추천) \n 나이차이는 ± 3살까지 추천됩니다. ",
                "계정문의", "계정 관련 문제를 해결하는 방법입니다. 어떤 문제가 있으신가요? (예: 로그인 문제, 비밀번호 찾기)",
                "기타문의", "어떤 도움이 필요하신가요? 질문을 입력해 주세요!",
                "실시간 고객센터 연결", "호출");

        if (predefinedResponses.containsKey(userMessage)) {
            return saveAndReturnResponse(userId, userMessage, predefinedResponses.get(userMessage));
        }

        if (userMessage.contains("이성 추천") || userMessage.contains("멤버 추천")) {
            int age = getAgeFromMessage(userMessage);
            int gender = getGenderFromMessage(userMessage);

            if (age == -1 || gender == -1) {
                return saveAndReturnResponse(userId, userMessage, "추천받고 싶은 성별과 나이를 입력해주세요! (예: 23살 여성 멤버 추천)");
            }

            String recommendedMembers = recommendMemberByAgeAndGender(gender, age);
            return saveAndReturnResponse(userId, userMessage, recommendedMembers);
        }

        for (String type : BUSINESS_TYPES) {
            if (userMessage.contains(type)) {
                List<ChatJongroRestaurants> restaurants = jongroRestaurantRepository.findRandomRestaurantsByType(type);
                if (restaurants.isEmpty()) {
                    return new ChatBotResponse("해당 유형의 음식점을 찾을 수 없습니다.");
                }
                ChatJongroRestaurants restaurant = restaurants.get(0);
                return new ChatBotResponse(
                        String.format("추천 맛집: %s\n주소: %s", restaurant.getBusinessName(), restaurant.getAddress()));
            }
        }

        List<ChatBotHistory> chatHistories = chatbotHistoryRepository.findByUserIdOrderByTimestampAsc(userId);
        logger.info("새로운 대화 기록 개수: {}", chatHistories.size());
        if (chatHistories.size() > 10) {
            chatHistories = chatHistories.subList(chatHistories.size() - 10, chatHistories.size());
        }

        List<Map<String, String>> messages = new ArrayList<>();
        for (ChatBotHistory chat : chatHistories) {
            messages.add(Map.of("role", chat.getRole(), "content", chat.getContent()));
        }

        messages.add(Map.of("role", "user", "content", userMessage));

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

    public List<ChatBotHistory> getChatHistoryByUserId(String userId) {
        List<ChatBotHistory> history = chatbotHistoryRepository.findByUserIdOrderByTimestampAsc(userId);
        return history;
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