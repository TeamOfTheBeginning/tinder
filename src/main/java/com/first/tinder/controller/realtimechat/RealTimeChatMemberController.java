package com.first.tinder.controller.realtimechat;

import com.first.tinder.dao.realtimechat.RealTimeChatMemberRepository;
import com.first.tinder.entity.Member;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@Slf4j
public class RealTimeChatMemberController { // 회원 프로필 이미지

    private final RealTimeChatMemberRepository realtimeChatmemberRepository;

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
}
