package com.first.tinder.service.chatbot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

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
        String timeZone = getTimeZone(city); // 도시명을 타임존으로 변환
        if (timeZone.isEmpty()) {
            return city + "의 시간 정보를 찾을 수 없습니다.";
        }

        String apiUrl = "https://www.timeapi.io/api/Time/current/zone?timeZone=" + timeZone;

        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(apiUrl, Map.class);

            if (response.getBody() != null) {
                Integer year = (Integer) response.getBody().get("year");
                Integer month = (Integer) response.getBody().get("month");
                Integer day = (Integer) response.getBody().get("day");
                Integer hour = (Integer) response.getBody().get("hour");
                Integer minute = (Integer) response.getBody().get("minute");

                return String.format(
                        "%s의 현재 날짜는 %d년 %d월 %d일이며, 시간은 %d시 %d분입니다.",
                        city, year, month, day, hour, minute
                );
            }
        } catch (Exception e) {
            System.err.println("🚨 시간 API 호출 오류: " + e.getMessage());
        }
        return city + "의 시간 정보를 가져올 수 없습니다.";
    }

    // ☀️ 특정 도시의 현재 날씨 조회
    public String getWeatherByCity(String city) {
        String englishCity = convertToEnglishCity(city);
        if (englishCity.isEmpty()) {
            return "어느 도시의 날씨를 원하시나요?";
        }

        String apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + englishCity +
                "&appid=" + openWeatherApiKey + "&units=metric&lang=kr";

        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(apiUrl, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> main = (Map<String, Object>) response.getBody().get("main");
                List<Map<String, Object>> weatherList = (List<Map<String, Object>>) response.getBody().get("weather");

                if (main == null || weatherList == null || weatherList.isEmpty()) {
                    return city + "의 날씨 정보를 가져올 수 없습니다.";
                }

                double temp = (double) main.get("temp");
                String description = weatherList.get(0).get("description").toString();

                return String.format("%s의 현재 기온은 %.1f°C이며, 날씨는 '%s'입니다.", city, temp, description);
            }
        } catch (Exception e) {
            System.err.println("🚨 날씨 API 호출 오류: " + e.getMessage());
        }

        return city + "의 날씨 정보를 가져올 수 없습니다.";
    }

    private String getTimeZone(String city) {
        Map<String, String> cityToTimeZone = Map.of(
                "서울", "Asia/Seoul",
                "도쿄", "Asia/Tokyo",
                "뉴욕", "America/New_York",
                "런던", "Europe/London",
                "베를린", "Europe/Berlin",
                "파리", "Europe/Paris",
                "시드니", "Australia/Sydney",
                "로스앤젤레스", "America/Los_Angeles",
                "베이징", "Asia/Shanghai",
                "모스크바", "Europe/Moscow"
        );

        return cityToTimeZone.getOrDefault(city, "");
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
