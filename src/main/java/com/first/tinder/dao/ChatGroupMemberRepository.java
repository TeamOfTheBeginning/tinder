package com.first.tinder.dao;

import com.first.tinder.entity.ChatGroup;
import com.first.tinder.entity.ChatGroupMember;
import com.first.tinder.entity.Follow;
import com.first.tinder.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatGroupMemberRepository extends JpaRepository<ChatGroupMember, Integer> {
    List<ChatGroupMember> findByMember(Member m);

    List<ChatGroupMember> findByChatGroup(ChatGroup chatGroup);
}
