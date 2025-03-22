package com.first.tinder.service.chatbot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class NewsService {

    @Value("${news.api.key}")
    private String newsApiKey;

    private final RestTemplate restTemplate;

    public NewsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getLatestNews() {
        String apiUrl = "https://newsapi.org/v2/top-headlines?country=us&apiKey=" + newsApiKey; // kr 뉴스 읽어오기가 안됨...
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(apiUrl, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> articles = (List<Map<String, Object>>) response.getBody().get("articles");
                if (articles != null && !articles.isEmpty()) {
                    StringBuilder newsBuilder = new StringBuilder("최근 뉴스입니다:\n");
                    // 상위 3개의 뉴스 제목 추출
                    for (int i = 0; i < Math.min(3, articles.size()); i++) {
                        Map<String, Object> article = articles.get(i);
                        newsBuilder.append("- ")
                                .append(article.get("title"))
                                .append("\n");
                    }
                    return newsBuilder.toString();
                }
            }
        } catch (Exception e) {
            System.err.println("뉴스 API 호출 오류: " + e.getMessage());
        }
        return "뉴스 정보를 가져올 수 없습니다.";
    }
}
