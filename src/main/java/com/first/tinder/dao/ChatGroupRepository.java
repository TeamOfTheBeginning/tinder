package com.first.tinder.dao;

import com.first.tinder.entity.ChatGroup;
import com.first.tinder.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatGroupRepository extends JpaRepository<ChatGroup, Integer> {
    Optional<ChatGroup> findByChatGroupId(int chatGroupId);

    @Query("SELECT c.chatGroup FROM ChatGroupMember c " +
            "WHERE c.chatGroup.memberCount = :memberCount " +
            "AND c.chatGroup IN (SELECT cm.chatGroup FROM ChatGroupMember cm WHERE cm.member IN :memberIds) " +
            "GROUP BY c.chatGroup " +
            "HAVING COUNT(DISTINCT c.member) = :memberCount")
    List<ChatGroup> findChatGroupByMemberIds(@Param("memberIds") List<Integer> memberIds, @Param("memberCount") int memberCount);
}
