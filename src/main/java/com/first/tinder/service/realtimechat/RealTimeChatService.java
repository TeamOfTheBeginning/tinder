package com.first.tinder.service.realtimechat;

import com.first.tinder.dto.realtimechat.MessageRequestDTO;
import com.first.tinder.dto.realtimechat.MessageResponseDTO;

/**
 * 실시간 채팅 서비스 인터페이스
 *
 * 이 인터페이스는 WebSocket을 통해 전송된 메시지를 처리하는 역할을 합니다.
 */
public interface RealTimeChatService {

    /**
     * 클라이언트에서 보낸 메시지를 처리하고, 응답 메시지를 반환합니다.
     *
     * @param request   클라이언트가 보낸 메시지 데이터
     * @param sessionId WebSocket 세션 ID
     * @param nickname  메시지를 보낸 사용자의 닉네임
     * @return 메시지를 처리한 후 생성된 응답 객체
     */
    MessageResponseDTO processMessage(MessageRequestDTO request, String sessionId, String nickname);
}
