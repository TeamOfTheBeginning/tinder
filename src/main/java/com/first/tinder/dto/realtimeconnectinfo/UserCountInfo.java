package com.first.tinder.dto.realtimeconnectinfo;

import com.first.tinder.entity.UserOnline;
import lombok.Data;

import java.util.List;

@Data
public class UserCountInfo {
    private int userCount;  // 접속자 수
    private List<UserOnline> usernames;  // 접속 중인 사용자 목록

    // 생성자
    public UserCountInfo(int userCount, List<UserOnline> usernames) {
        this.userCount = userCount;
        this.usernames = usernames;
    }

}

