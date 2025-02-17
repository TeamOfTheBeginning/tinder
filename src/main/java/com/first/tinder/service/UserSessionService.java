package com.first.tinder.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserSessionService {

    // 접속 중인 사용자를 관리할 List
    private List<String> onlineUsers = new ArrayList<>();

    // 사용자 접속 시 호출되는 메서드
    public void addUser(String username) {
        if (!onlineUsers.contains(username)) {
            onlineUsers.add(username);  // 중복된 사용자가 없으면 리스트에 추가
        }
    }

    // 사용자 퇴장 시 호출되는 메서드
    public void removeUser(String username) {
        onlineUsers.remove(username);  // 퇴장 시 리스트에서 삭제
    }

    // 현재 접속 중인 사용자 목록 반환
    public List<String> getOnlineUsers() {
        return new ArrayList<>(onlineUsers);  // 현재 접속 중인 사용자 목록 반환
    }

    // 현재 접속 중인 사용자 수 반환
    public int getUserCount() {
        return onlineUsers.size();  // 사용자 수 반환
    }
}

