package com.first.tinder.controller.realtimechat;

import com.first.tinder.dao.realtimechat.RealTimeChatMemberRepository;
import com.first.tinder.entity.Member;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;


@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@Slf4j
public class RealTimeChatMemberController { // 회원 프로필 이미지

    private final RealTimeChatMemberRepository realtimeChatmemberRepository;
    private static final Map<Long, CopyOnWriteArraySet<String>> roomUsers = new ConcurrentHashMap<>();


    @GetMapping("/profile-img/{nickname}")
    public ResponseEntity<String> getProfileImage(@PathVariable String nickname, HttpServletRequest request) {
        log.info("Fetching profile image for nickname: {}", nickname);

        String serverUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

        String profileImg = realtimeChatmemberRepository.findByNickname(nickname)
                .map(Member::getProfileImg)
                .filter(img -> !img.isEmpty())
                .map(img -> serverUrl + "/uploads/" + img)
                .orElse(serverUrl + "/uploads/default.jpg");

        return ResponseEntity.ok(profileImg);
    }

    @GetMapping("/{roomId}/users")
    public ResponseEntity<Set<String>> getChatRoomUsers(@PathVariable Long roomId) {
//        log.info("🔍 [{}] 채팅방 사용자 목록 요청됨", roomId);
        Set<String> users = roomUsers.getOrDefault(roomId, new CopyOnWriteArraySet<>());
        return ResponseEntity.ok(users);
    }

    public static void updateRoomUsers(Long roomId, String nickname, boolean isJoining) {
        roomUsers.computeIfAbsent(roomId, k -> new CopyOnWriteArraySet<>());
        if (isJoining) {
            roomUsers.get(roomId).add(nickname);
        } else {
            roomUsers.get(roomId).remove(nickname);
            if (roomUsers.get(roomId).isEmpty()) {
                roomUsers.remove(roomId);
            }
        }
//        log.info("✅ [{}] 사용자 목록 업데이트: {}", roomId, roomUsers.get(roomId));
    }
}
