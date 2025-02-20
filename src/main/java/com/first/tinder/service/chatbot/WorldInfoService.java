package com.first.tinder.service.chatbot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class WorldInfoService {

    private final RestTemplate restTemplate;

    @Value("${openweather.api.key}")
    private String openWeatherApiKey;

    public WorldInfoService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getTimeByCity(String city) {
        String timeZone = getTimeZone(city);
        String apiUrl = "http://worldtimeapi.org/api/timezone/" + timeZone;


        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(apiUrl, Map.class);

            if (response.getBody() != null && response.getBody().get("datetime") != null) {
                String dateTime = (String) response.getBody().get("datetime");
                LocalDateTime localDateTime = LocalDateTime.parse(dateTime.substring(0, 19));

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 M월 d일 (E) a h시 mm분", Locale.KOREAN);
                return localDateTime.format(formatter);
            }
        } catch (Exception e) {
            return "시간 정보를 가져올 수 없습니다.";
        }
        return "시간 정보를 가져올 수 없습니다.";
    }

    // ☀️ 특정 도시의 현재 날씨 조회
    public String getWeatherByCity(String city) {
        String englishCity = convertToEnglishCity(city);
        String apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + englishCity + "&appid=" + openWeatherApiKey + "&units=metric&lang=kr";


        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(apiUrl, Map.class);

            if (response.getBody() != null) {
                Map<String, Object> main = (Map<String, Object>) response.getBody().get("main");
                List<Map<String, Object>> weatherList = (List<Map<String, Object>>) response.getBody().get("weather");

                double temp = (double) main.get("temp");
                String description = weatherList.get(0).get("description").toString();

                return String.format("%s의 현재 기온은 %.1f°C이며, 날씨는 '%s'입니다.", city, temp, description);
            }
        } catch (Exception e) {
            return "날씨 정보를 가져올 수 없습니다.";
        }
        return "날씨 정보를 가져올 수 없습니다.";
    }

    // 🌍 도시별 표준 시간대 매핑
    private String getTimeZone(String city) {
        Map<String, String> cityToTimeZone = Map.of(
                "서울", "Asia/Seoul",
                "뉴욕", "America/New_York",
                "런던", "Europe/London",
                "도쿄", "Asia/Tokyo",
                "베를린", "Europe/Berlin"
        );

        return cityToTimeZone.getOrDefault(city, "Etc/UTC"); // 기본값: UTC
    }

    // 🔄 한글 도시명을 OpenWeather API에서 지원하는 영어로 변환
    private String convertToEnglishCity(String city) {
        Map<String, String> cityMap = Map.of(
                "서울", "Seoul",
                "뉴욕", "New York",
                "런던", "London",
                "도쿄", "Tokyo",
                "베를린", "Berlin"
        );

        return cityMap.getOrDefault(city, city); // 기본적으로 변경된 값이 없으면 원래 입력값 그대로 반환
    }
}
