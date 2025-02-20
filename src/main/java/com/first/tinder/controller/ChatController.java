package com.first.tinder.controller;

import com.first.tinder.dao.BlockRepository;
import com.first.tinder.dao.ChatGroupRepository;
import com.first.tinder.dao.MemberRepository;
import com.first.tinder.entity.Chat;
import com.first.tinder.entity.ChatGroup;
import com.first.tinder.entity.Member;
import com.first.tinder.service.BlockService;
import com.first.tinder.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    ChatService cs;

    @Autowired
    MemberRepository mr;

    @Autowired
    ChatGroupRepository cgr;

    @Autowired
    BlockService bs;

    @GetMapping("/findChatGroup")
    public HashMap<String,Object> findChatGroup(@RequestParam("memberId") int memberId) {
        HashMap<String,Object> result = new HashMap<>();
        List<ChatGroup> chatGroupList = cs.findChatGroup(memberId);
//        List<Member> chatMemberList = cs.findChatMember(memberId);
//        result.put("chatMemberList",chatMemberList);
        result.put("chatGroupList",chatGroupList);
        return result;
    }

    @GetMapping("/findChatGroupRandom")
    public HashMap<String,Object> findChatGroupRandom(@RequestParam("memberId") int memberId) {
        HashMap<String,Object> result = new HashMap<>();
        List<ChatGroup> chatGroupList = cs.findChatGroupRandom(memberId);
//        List<Member> chatMemberList = cs.findChatMember(memberId);
//        result.put("chatMemberList",chatMemberList);
        result.put("chatGroupList",chatGroupList);
        return result;
    }

    @GetMapping("/findChatGroupMember")
    public HashMap<String,Object> findChatGroupMember(@RequestParam("chatGroupId") int chatGroupId) {
        HashMap<String,Object> result = new HashMap<>();
        System.out.println("chatGroupId"+chatGroupId);
        List<Member> chatMemberList = cs.findChatMember(chatGroupId);
        System.out.println("chatMemberList"+chatMemberList);
        result.put("chatMemberList",chatMemberList);
        return result;
    }

    @GetMapping("/getChatList1")
    public HashMap<String,Object> getChatList1(@RequestParam("chatGroupId") int chatGroupId) {
        HashMap<String,Object> result = new HashMap<>();
        List<Chat> chatList = cs.findChatList(chatGroupId);
        result.put("chatList",chatList);
        return result;
    }

    @GetMapping("/getChatList2")
    public HashMap<String,Object> getChatList2(@RequestParam("myMemberId") int myMemberId, @RequestParam("matchedMemberId") int matchedMemberId) {
        HashMap<String,Object> result = new HashMap<>();
        System.out.println("myMemberId : "+myMemberId + " matchedMemberId : "+matchedMemberId);
        result = cs.findChatList2(myMemberId,matchedMemberId);
//        System.out.println("chatList : "+chatList);
        result.put("chatGroupId", result.get("chatGroupId"));
        result.put("chatList", result.get("chatList"));
        return result;
    }

    @PostMapping("/sendMessage")
    public HashMap<String, Object> sendMessage(
            @RequestParam("content") String content,
            @RequestParam("chatGroupId") int chatGroupId,
            @RequestParam("sender") int sender) {

        HashMap<String, Object> result = new HashMap<>();
        System.out.println("chatGroupId: " + chatGroupId + " sender: " + sender + " content: " + content);

        Member senderMember = mr.findById(sender)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        ChatGroup chatGroup = cgr.findById(chatGroupId)
                .orElseThrow(() -> new RuntimeException("Chat group not found"));

//        // 🔹 1️⃣ 채팅방 생성 후 1시간이 지났는지 확인
//        Instant createdInstant = chatGroup.getCreatedDate().toInstant();
//        Instant now = Instant.now();
//        Duration duration = Duration.between(createdInstant, now);
//
//        if (duration.toHours() >= 1) {
//            result.put("expired", true);
//            result.put("message", "This chat group has expired. You cannot send messages anymore.");
//            return result;
//        }

        // 🔹 2️⃣ 차단 여부 확인 (이전 코드 유지)
        boolean isBlocked = bs.isBlocked(senderMember, chatGroup);
        if (isBlocked) {
            result.put("blocked", true);
            result.put("message", "You cannot send messages. Either you blocked someone or you are blocked.");
            return result;
        }

//        // 🔹 3️⃣ 비활성화 확인
//        if(chatGroup.getActivation()==1){
//            result.put("deactivated", true);
//            result.put("message", "You cannot send messages. Either you blocked someone or you are blocked.");
//            return result;
//        }

        
        
        
        
        // 4 메시지 전송
        cs.sendMessage(chatGroupId, sender, content);
        List<Chat> chatList = cs.findChatList(chatGroupId);
        result.put("chatList", chatList);
        result.put("expired", false);
        result.put("blocked", false);

        return result;
    }



    @PostMapping("/sendMessageInAnonymityRoom")
    public HashMap<String, Object> sendMessageInAnonymityRoom(
            @RequestParam("content") String content,
            @RequestParam("chatGroupId") int chatGroupId,
            @RequestParam("sender") int sender) {

        HashMap<String, Object> result = new HashMap<>();
        System.out.println("chatGroupId: " + chatGroupId + " sender: " + sender + " content: " + content);

        Member senderMember = mr.findById(sender)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        ChatGroup chatGroup = cgr.findById(chatGroupId)
                .orElseThrow(() -> new RuntimeException("Chat group not found"));

        // 🔹 1️⃣ 채팅방 생성 후 1시간이 지났는지 확인
        Instant createdInstant = chatGroup.getCreatedDate().toInstant();
        Instant now = Instant.now();
        Duration duration = Duration.between(createdInstant, now);

        if (duration.toHours() >= 1) {
            result.put("expired", true);
            result.put("message", "This chat group has expired. You cannot send messages anymore.");
            return result;
        }

        // 🔹 2️⃣ 차단 여부 확인 (이전 코드 유지)
        boolean isBlocked = bs.isBlocked(senderMember, chatGroup);
        if (isBlocked) {
            result.put("blocked", true);
            result.put("message", "You cannot send messages. Either you blocked someone or you are blocked.");
            return result;
        }

        // 🔹 3️⃣ 비활성화 확인
        if(chatGroup.getActivation()==1){
            result.put("deactivated", true);
            result.put("message", "You cannot send messages. Either you blocked someone or you are blocked.");
            return result;
        }





        // 4 메시지 전송
        cs.sendMessageInAnonymityRoom(chatGroupId, sender, content);
        List<Chat> chatList = cs.findChatList(chatGroupId);
        result.put("chatList", chatList);
        result.put("expired", false);
        result.put("blocked", false);

        return result;
    }


    @PostMapping("/setMessageRoom")
    public HashMap<String,Object> setMessageRoom(@RequestParam("inviteMemberIdList") String inviteMemberIdList,@RequestParam("memberId") int memberId){
        HashMap<String,Object> result = new HashMap<>();
        List<Integer> inviteMemberIds = Arrays.stream(inviteMemberIdList.split(","))
                .map(Integer::parseInt)
                .collect(Collectors.toList());

        int chatGroupId = cs.setMessageRoom(inviteMemberIds,memberId);
        result.put("chatGroupId",chatGroupId);

        return result;
    }

    @PostMapping("/setAnonymousMessageRoom")
    public HashMap<String,Object> setAnonymousMessageRoom(@RequestParam("memberId") int memberId){
        HashMap<String,Object> result = new HashMap<>();
        int chatGroupId = cs.setAnonymousMessageRoom(memberId);
        result.put("chatGroupId",chatGroupId);
        return result;
    }

    @PostMapping("/setChatRoomDeactivated")
    public HashMap<String,Object> setChatRoomDeactivated(@RequestParam("chatGroupId") int chatGroupId){
        HashMap<String,Object> result = new HashMap<>();
        System.out.println("chatGroupId : "+chatGroupId+"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        cs.setChatRoomDeactivated(chatGroupId);
        result.put("result","yes");
        return result;
    }

}
