package com.first.tinder.dao;

import com.first.tinder.entity.ChatGroup;
import com.first.tinder.entity.ChatGroupMember;
import com.first.tinder.entity.Follow;
import com.first.tinder.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatGroupMemberRepository extends JpaRepository<ChatGroupMember, Integer> {
    List<ChatGroupMember> findByMember(Member m);

    List<ChatGroupMember> findByChatGroup(ChatGroup chatGroup);

    @Query("SELECT c.chatGroup FROM ChatGroupMember c " +
            "WHERE c.chatGroup.memberCount = 2 " +
            "AND c.chatGroup IN (SELECT cm.chatGroup FROM ChatGroupMember cm WHERE cm.member = :member1) " +
            "AND c.chatGroup IN (SELECT cm.chatGroup FROM ChatGroupMember cm WHERE cm.member = :member2)")
    List<ChatGroup> findTwoPersonChatGroup(@Param("member1") Member member1, @Param("member2") Member member2);




}
