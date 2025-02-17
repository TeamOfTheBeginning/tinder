package com.first.tinder.controller.realtimeconnectinfo;

import com.first.tinder.dao.UserRepository;
import com.first.tinder.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebSocketController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    // 웹소켓 연결 초기화 시, 클라이언트에게 접속자 수 전송
    @MessageMapping("/getUserCount")
    public void getUserCount() {
        // 웹소켓 연결 성공 후, 현재 접속자 수를 클라이언트에게 바로 전송
        messagingTemplate.convertAndSend("/topic/userCount", (int) userRepository.count());
    }

    // 사용자가 접속할 때마다 호출되는 메서드
    @MessageMapping("/join")
    @SendTo("/topic/userCount")
    public int handleJoin(User user) {
        // 사용자 접속 시 DB에 저장
        System.out.println("user"+user);
        userRepository.save(user);
        // 현재 접속 중인 사용자 수 반환
        return (int) userRepository.count();
    }

    // 사용자 퇴장 시 호출되는 메서드
    @MessageMapping("/leave")
    @SendTo("/topic/userCount")
    public int handleLeave(User user) {
        // 사용자 퇴장 시 DB에서 삭제
        System.out.println("user"+user);
        userRepository.delete(user);
        // 현재 접속 중인 사용자 수 반환
        return (int) userRepository.count();
    }

}

