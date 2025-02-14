package com.first.tinder.dao.realtimechat.Impl;

import com.first.tinder.common.enums.MessageType;
import com.first.tinder.dao.MemberRepository;
import com.first.tinder.dto.realtimechat.MessageRequestDTO;
import com.first.tinder.dto.realtimechat.MessageResponseDTO;
import com.first.tinder.entity.Member;
import com.first.tinder.service.realtimechat.RealTimeChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class RealTimeChatServiceImpl implements RealTimeChatService {

    private final MemberRepository memberRepository;

    @Override
    public MessageResponseDTO processMessage(MessageRequestDTO requestdto, String sessionId, String nickname) {
        nickname = Objects.requireNonNullElse(nickname, "익명");

        String profileImg = memberRepository.findByNickname(nickname)
                .map(Member::getProfileImg)
                .orElseGet(() -> "default.jpg");

        log.info("Nickname: {}, ProfileImg: {}", nickname, profileImg);

        return MessageResponseDTO.builder()
                .type(MessageType.CHAT)
                .sessionId(sessionId)
                .nickname(nickname)
                .content(requestdto.getContent())
                .profileImg(profileImg)
                .build();
    }
}
