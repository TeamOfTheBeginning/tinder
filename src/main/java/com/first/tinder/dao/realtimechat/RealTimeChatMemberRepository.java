package com.first.tinder.dao.realtimechat;

import com.first.tinder.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RealTimeChatMemberRepository extends JpaRepository<Member, Long> {
        Optional<Member> findByNickname(String nickname);
    }
