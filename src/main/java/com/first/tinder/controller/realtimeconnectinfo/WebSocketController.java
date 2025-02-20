package com.first.tinder.controller.realtimeconnectinfo;

import com.first.tinder.dao.UserOnlineRepository;
import com.first.tinder.dto.realtimeconnectinfo.UserCountInfo;
import com.first.tinder.entity.UserOnline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@Controller
public class WebSocketController {

    @Autowired
    private UserOnlineRepository userOnlineRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    // 웹소켓 연결 초기화 시, 클라이언트에게 접속자 수 전송
    @MessageMapping("/getUserCount")
    public void getUserCount() {
        System.out.println("getUserCount");

        List<UserOnline> usernames = userOnlineRepository.findAll() ;
//        usernames=userRepository.findAll();

        UserCountInfo userCountInfo = new UserCountInfo((int) userOnlineRepository.count()+1000, usernames);

//        UserCountInfo.setUserCount((int) userRepository.count());
        // 웹소켓 연결 성공 후, 현재 접속자 수를 클라이언트에게 바로 전송
        messagingTemplate.convertAndSend("/topic/real_chat/userCount", userCountInfo);
    }

    // 사용자가 접속할 때마다 호출되는 메서드
    @MessageMapping("/join")
    @SendTo("/topic/real_chat/userCount")
    public UserCountInfo handleJoin(UserOnline memberId) {
        // 사용자 접속 시 DB에 저장
        System.out.println("user"+memberId);
        userOnlineRepository.save(memberId);



        List<UserOnline> usernames = new ArrayList<>();

        usernames= userOnlineRepository.findAll();

        UserCountInfo userCountInfo = new UserCountInfo((int) userOnlineRepository.count()+1000, usernames);
        // 현재 접속 중인 사용자 수 반환
        return userCountInfo;
    }

    // 사용자 퇴장 시 호출되는 메서드
    @MessageMapping("/leave")
    @SendTo("/topic/real_chat/userCount")
    public UserCountInfo handleLeave(UserOnline memberId) {
        // 사용자 퇴장 시 DB에서 삭제
        System.out.println("user"+memberId);
        userOnlineRepository.delete(memberId);
        // 현재 접속 중인 사용자 수 반환


        List<UserOnline> usernames = new ArrayList<>();
        usernames= userOnlineRepository.findAll();
        UserCountInfo userCountInfo = new UserCountInfo((int) userOnlineRepository.count()+1000, usernames);

        return userCountInfo;
    }

}

