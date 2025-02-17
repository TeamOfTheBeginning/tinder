package com.first.tinder.entity.realtimechat;

import com.first.tinder.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RealTimeChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private boolean isPrivate;
    private String password;

    @ManyToMany
    @JoinTable(
            name = "chat_room_members",
            joinColumns = @JoinColumn(name = "chat_room_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id")
    )
    private List<Member> members; // ✅ 채팅방 멤버 리스트 추가

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private Member creator; // ✅ 채팅방을 만든 사용자 정보 저장

}
