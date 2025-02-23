package com.first.tinder.service.chatbot;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class MusicService {

    private static final String BILLBOARD_URL = "https://www.billboard.com/charts/hot-100/"; // 빌보드차트 url
    private static final String MELON_URL = "https://www.melon.com/chart/index.htm"; // 멜론차트 url

    private static final Map<String, List<String>> MOOD_KEYWORDS = Map.of(
            "happy", List.of("dance", "party", "pop", "fun"),
            "sad", List.of("slow", "ballad", "emotional", "melancholy"),
            "romantic", List.of("love", "romantic", "valentine", "heart")
    );

    public String getLatestMusic() {
        return getMusicFromBillboard(); // 빌보드 크롤링
    }

    public String getLatestKoreanMusic() {
        return getMusicFromMelon(); // 멜론 크롤링
    }

    public String getMusicByMood(String mood) {
        if (mood == null) return "기분을 입력해주세요! (예: 행복할 때, 슬플 때, 로맨틱할 때 등)";

        List<String> songs = getBillboardSongs();
        if (songs.isEmpty()) return "현재 최신 음악 데이터를 불러올 수 없습니다.";

        List<String> filteredSongs = new ArrayList<>();
        for (String song : songs) {
            for (String keyword : MOOD_KEYWORDS.getOrDefault(mood.toLowerCase(), List.of())) {
                if (song.toLowerCase().contains(keyword)) {
                    filteredSongs.add(song);
                }
            }
        }

        return filteredSongs.isEmpty() ?
                "해당 분위기에 맞는 추천 곡이 없습니다. 최신 곡을 확인하세요!\n" +
                        getMusicFromBillboard()
                : mood + " 분위기 추천 곡:\n- " + String.join("\n- ", filteredSongs.subList(0, Math.min(3, filteredSongs.size())));
    }

    private String getMusicFromBillboard() {
        List<String> songs = getBillboardSongs();
        return songs.isEmpty() ? "최신 노래 정보를 가져올 수 없습니다."
                : " Billboard Top 5:\n- " + String.join("\n- ", songs.subList(0, Math.min(5, songs.size())));
    }

    private List<String> getBillboardSongs() {
        List<String> songList = new ArrayList<>();
        try {
            Document doc = Jsoup.connect(BILLBOARD_URL).get();
            Elements songs = doc.select(".o-chart-results-list__item h3");
            for (Element song : songs) {
                songList.add(song.text());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return songList;
    }

    private String getMusicFromMelon() {
        try {
            Document doc = Jsoup.connect(MELON_URL)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .referrer("http://www.google.com")
                    .timeout(5000)
                    .get();

            Elements songElements = doc.select("div.ellipsis.rank01 a");
            List<String> songList = new ArrayList<>();
            for (Element song : songElements) {
                songList.add(song.text());
            }

            if (!songList.isEmpty()) {
                return "멜론 최신 차트 Top 5:\n- " +
                        String.join("\n- ", songList.subList(0, Math.min(5, songList.size())));
            }
        } catch (IOException e) {
            e.printStackTrace();
            return "멜론 최신 차트 정보를 가져오는 중 오류가 발생했습니다.";
        }
        return "현재 멜론 최신 차트 정보를 찾을 수 없습니다.";
    }
}
