package com.first.tinder.service;

import com.first.tinder.dao.ChatGroupMemberRepository;
import com.first.tinder.dao.ChatGroupRepository;
import com.first.tinder.dao.ChatRepository;
import com.first.tinder.dao.MemberRepository;
import com.first.tinder.entity.Chat;
import com.first.tinder.entity.ChatGroup;
import com.first.tinder.entity.ChatGroupMember;
import com.first.tinder.entity.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ChatService {

    @Autowired
    MemberRepository mr;

    @Autowired
    ChatGroupRepository cgr;

    @Autowired
    ChatGroupMemberRepository cgmr;

    @Autowired
    ChatRepository cr;

    public List<ChatGroup> findChatGroup(int memberId) {
        //챗 그룹 리스트 생성
        List<ChatGroup> chatGroupList = new ArrayList<>();
        
        //받은 memberid로 맴버객체조회
        Optional<Member> member = mr.findByMemberId(memberId);

        //맴버존재 한다면
        if (member.isPresent()) {
            Member m = member.get();
            
            //맴버로 ChatGroupMember 객체 조회
            List<ChatGroupMember> chatGroupMemberList = cgmr.findByMember(m);
            
            //ChatGroupMember 객체에서 ChatGroup 추출
            for(ChatGroupMember chatGroupMember : chatGroupMemberList) {
                
                //리스트에 담는다
                chatGroupList.add(chatGroupMember.getChatGroup());
            }




        }


        return chatGroupList;
    }

    public List<Member> findChatMember(int chatGroupId) {
        List<Member> memberList = new ArrayList<>();
        //받은 memberid로 맴버객체조회
        Optional<ChatGroup> chatGroup = cgr.findByChatGroupId(chatGroupId);
        if (chatGroup.isPresent()) {
            ChatGroup c = chatGroup.get();
            
            //맴버로 ChatGroupMember 객체 조회
            List<ChatGroupMember> chatGroupMemberList = cgmr.findByChatGroup(c);

            //내가 포함된 ChatGroupMemberList에서 ChatGroup 추출
            for(ChatGroupMember chatGroupMember : chatGroupMemberList) {
                    memberList.add(chatGroupMember.getMember());
            }
        }
        return memberList;
    }


    public List<Chat> findChatList(int chatGroupId) {
        List<Chat> chatList = new ArrayList<>();
        Optional<ChatGroup> chatGroup = cgr.findByChatGroupId(chatGroupId);
        if (chatGroup.isPresent()) {
            ChatGroup c = chatGroup.get();
            chatList = cr.findByChatGroup(c);
        }else {
            chatList = null;
        }
        return chatList;
    }

    public void sendMessage(int chatGroupId, int sender, String content) {
        Optional<ChatGroup> chatGroup = cgr.findByChatGroupId(chatGroupId);
        if (chatGroup.isPresent()) {
            ChatGroup c = chatGroup.get();

            Optional<Member> member = mr.findByMemberId(sender);
            if (member.isPresent()) {
                Member m = member.get();

                Chat chat = new Chat();
                chat.setChatGroup(c);
                chat.setSender(m);
                chat.setContent(content);
                cr.save(chat);
                System.out.println("메시지 저장완료");

            }
        }
    }

    public HashMap<String,Object> findChatList2(int myMemberId, int matchedMemberId) {
        HashMap<String,Object> result = new HashMap<>();
        List<Chat> chatList = new ArrayList<>();
        List<ChatGroup> chatGroupList = new ArrayList<>();
        int chatGroupId = 0;

        Optional<Member> myMember = mr.findByMemberId(myMemberId);
        if (myMember.isPresent()) {
            Member m = myMember.get();
            System.out.println("m"+m);

            Optional<Member> matchedMember = mr.findByMemberId(matchedMemberId);
            if (matchedMember.isPresent()) {
                Member mm = matchedMember.get();


                List<ChatGroupMember> chatGroupMemberList = cgmr.findByMember(m);
                System.out.println("chatGroupMemberList"+chatGroupMemberList);

                for(ChatGroupMember chatGroupMember : chatGroupMemberList) {
                    System.out.println("mm"+mm);
                    System.out.println("chatGroupMember"+chatGroupMember);

                    ChatGroup chatGroup = chatGroupMember.getChatGroup();

                    List<ChatGroupMember> chatGroupMemberList1 = cgmr.findByChatGroup(chatGroup);

                    for(ChatGroupMember chatGroupMember1 : chatGroupMemberList1) {
                        System.out.println(chatGroupMember1.getMember().getMemberId());

                        if(mm==chatGroupMember1.getMember()){
                            if(chatGroupMember.getChatGroup().getMemberCount()==2){
                                System.out.println("chatGroupMember.getChatGroup().getChatGroupId()@@@@@@@@@@@@@@@@@@@@@@@@"+chatGroupMember.getChatGroup().getChatGroupId());
                                chatGroupList.add( chatGroupMember.getChatGroup());

                                chatGroupId = chatGroupList.get(0).getChatGroupId();


                            }else{
                                System.out.println("2인 챗방은 없어여");
                            }
                        } else{
                            System.out.println("mm!==chatGroupMember.getMember()");
                        }

                    }



                }
            }
        }

        System.out.println("chatGroupList"+chatGroupList);



        for(ChatGroup chatGroup : chatGroupList) {
            chatList=cr.findByChatGroup(chatGroup);
        }


        result.put("chatGroupId",chatGroupId);
        result.put("chatList",chatList);


        return result;
    }
}
