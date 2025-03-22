package com.first.tinder.service;

import com.first.tinder.dao.BlockRepository;
import com.first.tinder.dao.ChatGroupMemberRepository;
import com.first.tinder.dao.ChatGroupRepository;
import com.first.tinder.entity.ChatGroup;
import com.first.tinder.entity.ChatGroupMember;
import com.first.tinder.entity.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BlockService {

    @Autowired
    ChatGroupRepository chatGroupRepository;

    @Autowired
    ChatGroupMemberRepository chatGroupMemberRepository;

    @Autowired
    BlockRepository blockRepository;

    public boolean isBlocked(Member sender, ChatGroup chatGroup) {
        // 1️⃣ 채팅방에 속한 멤버들을 가져오기
        List<ChatGroupMember> chatMembers = chatGroupMemberRepository.findByChatGroup(chatGroup);

        // 2️⃣ 채팅방의 모든 멤버를 확인하며 차단 여부 체크
        for (ChatGroupMember chatMember : chatMembers) {
            Member member = chatMember.getMember();
            boolean blocked = blockRepository.existsByBlockerAndBlocked(sender, member) ||
                    blockRepository.existsByBlockerAndBlocked(member, sender);
            if (blocked) {
                return true;
            }
        }
        return false;
    }
}
