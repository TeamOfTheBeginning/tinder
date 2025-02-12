package com.first.tinder.controller;

import com.first.tinder.entity.Chat;
import com.first.tinder.entity.ChatGroup;
import com.first.tinder.entity.Member;
import com.first.tinder.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    ChatService cs;

    @GetMapping("/findChatGroup")
    public HashMap<String,Object> findChatGroup(@RequestParam("memberId") int memberId) {
        HashMap<String,Object> result = new HashMap<>();

        List<ChatGroup> chatGroupList = cs.findChatGroup(memberId);

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
    public HashMap<String,Object> sendMessage(@RequestParam("content") String content, @RequestParam("chatGroupId") int chatGroupId, @RequestParam("sender") int sender ) {
        HashMap<String,Object> result = new HashMap<>();
        System.out.println("chatGroupId"+chatGroupId +"sender"+sender +"content"+content);
        cs.sendMessage(chatGroupId, sender, content);
        List<Chat> chatList = cs.findChatList(chatGroupId);
        result.put("chatList",chatList);
        return result;

    }



}
