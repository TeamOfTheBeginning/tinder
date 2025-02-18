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

import java.util.*;

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

    @Autowired
    private MemberService2 ms2;

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

                ChatGroup chatGroup =chatGroupMember.getChatGroup();

                if(chatGroup.getAnonymity()==0){

                    System.out.println("chatGroup.getChatGroupId()"+chatGroup.getChatGroupId());
                    //리스트에 담는다
                    chatGroupList.add(chatGroup);}
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

        //내 정보 조회
        Optional<Member> myMember = mr.findByMemberId(myMemberId);
        if (myMember.isPresent()) {
            Member m = myMember.get();
            System.out.println("m"+m);

            //매칭 맴버 조회
            Optional<Member> matchedMember = mr.findByMemberId(matchedMemberId);
            if (matchedMember.isPresent()) {
                Member mm = matchedMember.get();


                //챗 그룹 맴버 조회
//                List<ChatGroupMember> chatGroupMemberList = cgmr.findByMember(m);
//                System.out.println("chatGroupMemberList"+chatGroupMemberList);
//
//                for(ChatGroupMember chatGroupMember : chatGroupMemberList) {
//                    System.out.println("mm"+mm);
//                    System.out.println("chatGroupMember"+chatGroupMember);
//
//                    ChatGroup chatGroup = chatGroupMember.getChatGroup();
//
//                    List<ChatGroupMember> chatGroupMemberList1 = cgmr.findByChatGroup(chatGroup);


                    
                    List<ChatGroup> existingChatGroups = cgmr.findTwoPersonChatGroup(m, mm);

                    if (!existingChatGroups.isEmpty()) {
                        // 기존 2인 톡방이 존재하면 첫 번째 방 ID를 사용
                        chatGroupId = existingChatGroups.get(0).getChatGroupId();
                        System.out.println("기존 2인 톡방 존재: " + chatGroupId);

                    } else {
                        // 2인 톡방이 없으므로 새로 생성
                        System.out.println("2인 챗방이 없어서 새로 만듭니다.");
                        ChatGroup chatGroup2 = new ChatGroup();
                        chatGroup2.setCreatedBy(m);
                        chatGroup2.setMemberCount(2);
                        chatGroup2.setChatGroupName("2인 매칭 채팅방");
                        ChatGroup returnChatGroup = cgr.save(chatGroup2);

                        ChatGroupMember chatGroupMember2 = new ChatGroupMember();
                        chatGroupMember2.setChatGroup(returnChatGroup);
                        chatGroupMember2.setMember(m);
                        cgmr.save(chatGroupMember2);

                        ChatGroupMember chatGroupMember3 = new ChatGroupMember();
                        chatGroupMember3.setChatGroup(returnChatGroup);
                        chatGroupMember3.setMember(mm);
                        cgmr.save(chatGroupMember3);

                        chatGroupId = returnChatGroup.getChatGroupId();
                    }




//                    for(ChatGroupMember chatGroupMember1 : chatGroupMemberList1) {
//                        System.out.println(chatGroupMember1.getMember().getMemberId()+"★★★★★★★★★★★★★★★★★★★★★★★★★");
//
//                        if(mm.equals(chatGroupMember1.getMember())){
//                            System.out.println("chatGroupMember1.getMember()"+chatGroupMember1.getMember());
//                            System.out.println("톡방 사람이 같은 경우 발견2!!");
//
//
//
//                            if(chatGroupMember.getChatGroup().getMemberCount()==2){
//                                System.out.println("톡방 사람이 같고, 2인 톡방이네여");
//                                System.out.println("chatGroupMember.getChatGroup().getChatGroupId()@@@@@@@@@@@@@@@@@@@@@@@@"+chatGroupMember.getChatGroup().getChatGroupId());
//                                chatGroupList.add( chatGroupMember.getChatGroup());
//
//                                chatGroupId = chatGroupList.get(0).getChatGroupId();
//
//                                break;
//                            }else if(!(chatGroupMember.getChatGroup().getMemberCount()==2)){
//                                System.out.println("톡방 사람이 같은데, 2인 톡방은 아니네여");
//                                System.out.println("2인 챗방은 없어서 만듭니다.");
//                                ChatGroup chatGroup2 = new ChatGroup();
//                                chatGroup2.setCreatedBy(m);
//                                chatGroup2.setMemberCount(2);
//                                chatGroup2.setChatGroupName("2인 매칭 채팅방");
//                                ChatGroup returnChatGroup = cgr.save(chatGroup2);
//
//                                ChatGroupMember chatGroupMember2 = new ChatGroupMember();
//                                chatGroupMember2.setChatGroup(returnChatGroup);
//                                chatGroupMember2.setMember(m);
//                                cgmr.save(chatGroupMember2);
//
//                                ChatGroupMember chatGroupMember3 = new ChatGroupMember();
//                                chatGroupMember3.setChatGroup(returnChatGroup);
//                                chatGroupMember3.setMember(mm);
//                                cgmr.save(chatGroupMember3);
//
//                                chatGroupId = returnChatGroup.getChatGroupId();
//                            }else{
//                                System.out.println("이건 무슨 경우지?");
//                            }
//
//
//
//                        } else{
//                            System.out.println("톡방 사람이 다른 경우 발견");
//                            System.out.println("mm!==chatGroupMember.getMember()");
//                            System.out.println(chatGroupMember1.getMember().getMemberId()+"☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆");
//                        }
//
//
//                    }


//                }
            }
        }
        System.out.println("chatGroupList"+chatGroupList);

        Optional<ChatGroup> chatGroup = cgr.findByChatGroupId(chatGroupId);
        if (chatGroup.isPresent()) {
            ChatGroup c = chatGroup.get();
            chatList=cr.findByChatGroup(c);
        }



//        for(ChatGroup chatGroup : chatGroupList) {
//            chatList=cr.findByChatGroup(chatGroup);
//        }

        result.put("chatGroupId",chatGroupId);
        result.put("chatList",chatList);

        return result;
    }

    public int setMessageRoom(List<Integer> memberIds, int memberId) {
        // Sort memberIds in ascending order
        Collections.sort(memberIds);

        List<Member> members = new ArrayList<>();

        for(int memberId1 : memberIds){

            Optional<Member> member1 = mr.findById(memberId1);
            if (member1.isPresent()) {
                Member m = member1.get();
                members.add(m);
            }
        }

        System.out.println("members"+members);
        System.out.println("members.size()"+members.size());

        List<ChatGroup> existingChatGroups = new ArrayList<>();
        existingChatGroups = cgmr.findChatGroupByMembers(members, members.size());

        // Find existing chat group with the same members
//        List<ChatGroup> existingChatGroups = cgr.findChatGroupByMemberIds(memberIds, memberIds.size());

        if (!existingChatGroups.isEmpty()) {
            return existingChatGroups.get(0).getChatGroupId();  // If a matching group is found, return its ID
        }

        // If no existing group is found, create a new chat group
        ChatGroup newChatGroup = new ChatGroup();
        newChatGroup.setChatGroupName("New Group for " + String.join(", ", memberIds.toString()));
        newChatGroup.setMemberCount(memberIds.size());  // Set the number of members for the new group

        // Create the new group and associate members
        Optional<Member> creatorMember = mr.findById(memberId);
        if (creatorMember.isPresent()) {
            newChatGroup.setCreatedBy(creatorMember.get());
        }

        // Save the new chat group
        cgr.save(newChatGroup);

        // Add members to the new chat group
        for (Integer memberId1 : memberIds) {
            Optional<Member> member = mr.findById(memberId1);
            if (member.isPresent()) {
                ChatGroupMember newChatGroupMember = new ChatGroupMember();
                newChatGroupMember.setChatGroup(newChatGroup);
                newChatGroupMember.setMember(member.get());
                cgmr.save(newChatGroupMember);
            }
        }

        // Return the ID of the newly created chat group
        return newChatGroup.getChatGroupId();
    }


    public List<ChatGroup> findChatGroupRandom(int memberId) {
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

                ChatGroup chatGroup =chatGroupMember.getChatGroup();

                if(chatGroup.getAnonymity()==1){

                    System.out.println("chatGroup.getChatGroupId()"+chatGroup.getChatGroupId());

                //리스트에 담는다
                chatGroupList.add(chatGroup);}
            }






        }


        return chatGroupList;
    }

    public int setAnonymousMessageRoom(int memberId) {
        ChatGroup newChatGroup = new ChatGroup();

        Optional<Member> member = mr.findById(memberId);
        if (member.isPresent()) {
            Member m = member.get();
            int age = m.getAge();
            int gender = m.getGender();

            Member oppositeGender;

            if (gender==0) {
                System.out.println("gender2 : "+gender);
                gender=1;
                System.out.println("gender3 : "+gender);
                oppositeGender = ms2.getOppsiteGender(gender,age);
            }else {
                System.out.println("gender22 : "+gender);
                gender=0;
                System.out.println("gender33 : "+gender);
                oppositeGender = ms2.getOppsiteGender(gender,age);
            }


            // If no existing group is found, create a new chat group

            newChatGroup.setChatGroupName("익명채팅");
            newChatGroup.setMemberCount(2);  // Set the number of members for the new group
            newChatGroup.setCreatedBy(m);
            newChatGroup.setAnonymity(1);

            // Save the new chat group
            cgr.save(newChatGroup);

            ChatGroupMember newChatGroupMember = new ChatGroupMember();
            newChatGroupMember.setChatGroup(newChatGroup);
            newChatGroupMember.setMember(member.get());
            cgmr.save(newChatGroupMember);

            ChatGroupMember newChatGroupMember2 = new ChatGroupMember();
            newChatGroupMember2.setChatGroup(newChatGroup);
            newChatGroupMember2.setMember(oppositeGender);
            cgmr.save(newChatGroupMember2);
        }

        return newChatGroup.getChatGroupId();
    }
}
