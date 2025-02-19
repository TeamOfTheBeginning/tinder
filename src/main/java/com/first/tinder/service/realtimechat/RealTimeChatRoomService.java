package com.first.tinder.service.realtimechat;

import com.first.tinder.dao.MemberRepository;
import com.first.tinder.dao.realtimechat.RealTimeChatRoomRepository;
import com.first.tinder.entity.Member;
import com.first.tinder.entity.realtimechat.RealTimeChatRoom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RealTimeChatRoomService {

    private final RealTimeChatRoomRepository chatRoomRepository;
    private final MemberRepository memberRepository;

    /** ✅ 채팅방 생성 */
    @Transactional
    public RealTimeChatRoom createRoom(String name, boolean isPrivate, String password, String creatorNickname) {
        log.info("채팅방 생성 -> Name: {}, isPrivate: {}, Password: {}, Creator: {}", name, isPrivate, password, creatorNickname);

        if (!isPrivate) {
            password = null; // ✅ 공개방이면 비밀번호를 강제로 null 처리
        }

        Member creator = memberRepository.findByNickname(creatorNickname)
                .orElseThrow(() -> new IllegalArgumentException("해당 닉네임을 가진 사용자가 존재하지 않습니다: " + creatorNickname));

        RealTimeChatRoom chatRoom = RealTimeChatRoom.builder()
                .name(name)
                .isPrivate(isPrivate)
                .password(password)
                .creator(creator)
                .build();

        return chatRoomRepository.save(chatRoom);
    }

    public List<RealTimeChatRoom> getAllChatRooms() {
        return chatRoomRepository.findAll();
    }

    @Transactional(readOnly = true)
    public boolean isUserAllowed(Long roomId, Member user) {
        return chatRoomRepository.findByIdWithMembers(roomId)
                .map(room -> !room.isPrivate() || (room.getMembers() != null && room.getMembers().contains(user)))
                .orElse(false);
    }

    @Transactional
    public boolean addUserToRoom(Long roomId, Member user) {
        Optional<RealTimeChatRoom> chatRoomOpt = chatRoomRepository.findByIdWithMembers(roomId);

        if (chatRoomOpt.isEmpty()) {
//            log.warn("🚨 채팅방({})을 찾을 수 없음!", roomId);
            return false;
        }

        RealTimeChatRoom chatRoom = chatRoomOpt.get();

        if (chatRoom.getMembers().contains(user)) {
//            log.info("✅ 사용자({})는 이미 채팅방({})에 참여 중", user.getNickname(), roomId);
            return true;
        }

        chatRoom.getMembers().add(user);
        chatRoomRepository.save(chatRoom);
        log.info("✅ 사용자({})가 채팅방({})에 추가됨", user.getNickname(), roomId);
        return true;
    }

    @Transactional(readOnly = true)
    public boolean validateRoomPassword(Long roomId, String password) {
        Optional<RealTimeChatRoom> chatRoomOpt = chatRoomRepository.findById(roomId);

        if (chatRoomOpt.isPresent()) {
            RealTimeChatRoom room = chatRoomOpt.get();
            return room.getPassword() != null && room.getPassword().equals(password);
        }

        return false;
    }

    @Transactional
    public boolean deleteRoom(Long roomId, String nickname) {
        Optional<RealTimeChatRoom> chatRoomOpt = chatRoomRepository.findById(roomId);

        if (chatRoomOpt.isEmpty()) {
//            log.warn("🚨 삭제 실패: 채팅방({})을 찾을 수 없음!", roomId);
            return false;
        }

        RealTimeChatRoom chatRoom = chatRoomOpt.get();

        // ✅ 방 생성자만 삭제 가능 (닉네임 확인)
        if (!chatRoom.getCreator().getNickname().equals(nickname)) {
//            log.warn("🚨 삭제 실패: {}는 채팅방({})의 생성자가 아님!", nickname, roomId);
            return false;
        }

        chatRoomRepository.delete(chatRoom);
//        log.info("✅ 채팅방({})이 {}에 의해 삭제됨", roomId, nickname);
        return true;
    }
}
