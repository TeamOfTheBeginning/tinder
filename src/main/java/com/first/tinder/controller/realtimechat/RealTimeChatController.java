package com.first.tinder.controller.realtimechat;

import com.first.tinder.dto.realtimechat.MessageRequestDTO;
import com.first.tinder.dto.realtimechat.MessageResponseDTO;
import com.first.tinder.entity.Member;
import com.first.tinder.service.realtimechat.RealTimeChatRoomService;
import com.first.tinder.dao.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class RealTimeChatController { // 실시간 채팅 메시지를 처리

    private final RealTimeChatRoomService chatRoomService;
    private final MemberRepository memberRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * WebSocket 메시지 전송 (채팅방별 메시지 전송)
     */
    @MessageMapping("/real_chat/{roomId}")
    public void sendChatMessage(@Payload MessageRequestDTO requestDto, SimpMessageHeaderAccessor accessor) {
        if (requestDto == null || requestDto.getContent() == null || requestDto.getContent().trim().isEmpty()) {
            log.warn("🚨 잘못된 메시지: {}", requestDto);
            return;
        }

        Long roomId = requestDto.getRoomId();
        if (roomId == null) {
            log.warn("🚨 roomId가 누락됨: {}", requestDto);
            return;
        }

        String nickname = requestDto.getNickname();
        if (nickname == null || nickname.trim().isEmpty()) {
            if (accessor.getUser() != null) {
                nickname = accessor.getUser().getName();
            }
        }

        if (nickname == null || nickname.trim().isEmpty()) {
//            log.warn("🚨 닉네임이 누락됨: {}", requestDto);
            return;
        }

//        log.info("💬 [채팅 메시지] Room ID: {}, 닉네임: {}, 내용: {}", roomId, nickname, requestDto.getContent());

        Member user = memberRepository.findByNickname(nickname).orElse(null);

        if (user == null) {
//            log.warn("🚨 사용자({})를 찾을 수 없음!", nickname);
            return;
        }

        if (!chatRoomService.isUserAllowed(roomId, user)) {
//            log.warn("🚨 권한 없는 사용자({})가 방 {}에 메시지 전송 시도!", nickname, roomId);

            boolean added = chatRoomService.addUserToRoom(roomId, user);
            if (!added) {
//                log.warn("🚨 사용자({})를 방 {}에 추가할 수 없음!", nickname, roomId);
                return;
            }

//            log.info("✅ 사용자({})가 방 {}에 정상적으로 추가됨", nickname, roomId);
        }

        MessageResponseDTO response = MessageResponseDTO.builder()
                .roomId(roomId)
                .content(requestDto.getContent())
                .nickname(nickname)
                .profileImg(user.getProfileImg() != null ? user.getProfileImg() : "/userimg/default.jpg")
                .build();

        messagingTemplate.convertAndSend("/topic/real_chat/" + roomId, response);
    }
}
