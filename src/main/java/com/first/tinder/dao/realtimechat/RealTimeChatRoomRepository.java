package com.first.tinder.dao.realtimechat;

import com.first.tinder.entity.realtimechat.RealTimeChatRoom;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RealTimeChatRoomRepository extends JpaRepository<RealTimeChatRoom, Long> {

    @EntityGraph(attributePaths = {"members"})
    @Query("SELECT r FROM RealTimeChatRoom r LEFT JOIN FETCH r.members WHERE r.id = :roomId")
    Optional<RealTimeChatRoom> findByIdWithMembers(@Param("roomId") Long roomId);
}
