package com.first.tinder.controller.realtimechat;

import com.first.tinder.dao.realtimechat.RealTimeChatMemberRepository;
import com.first.tinder.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@CrossOrigin(origins = "http://localhost:3000") // React 프론트엔드 허용
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@Slf4j
public class RealTimeChatMemberController {

    private final RealTimeChatMemberRepository realtimeChatmemberRepository;

    @GetMapping("/profile-img/{nickname}")
    public ResponseEntity<String> getProfileImage(@PathVariable String nickname) {
        log.info("Fetching profile image for nickname: {}", nickname);

        String profileImg = realtimeChatmemberRepository.findByNickname(nickname)
                .map(Member::getProfileImg)
                .orElse("default.jpg");

        return ResponseEntity.ok(profileImg);
    }
}
