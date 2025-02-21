package com.first.tinder.service;

import com.first.tinder.dao.*;
import com.first.tinder.entity.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class MemberService2 {

    @Autowired
    MemberRepository mr;

    @Autowired
    MemberLikseRepository mlr;

    @Autowired
    NotificationRepository nr;

    @Autowired
    SseEmitterService ses;

    @Autowired
    ChatGroupRepository cgr;

    @Autowired
    ChatGroupMemberRepository cgmr;

    @Autowired
    BlockRepository br;

    public Member getOppsiteGender(int gender, int age) {
//        List<Member> members = mr.findByGender(gender);


        int ageRange = 3;

        List<Member> filteredMembers = mr.findByGenderAndAgeRange(gender, age - ageRange, age + ageRange);


        if (filteredMembers.isEmpty()) {
            return null;
        }

        Random random = new Random();
        return filteredMembers.get(random.nextInt(filteredMembers.size()));

    }

    public void insert(MemberLikes memberLikes) {
        mlr.save(memberLikes);
    }




    public String checkLikes(MemberLikes memberLikes) {
        String msg ;
        int liked = memberLikes.getLiked();
        int liker = memberLikes.getLiker();

        System.out.println("liked"+liked);
        System.out.println("liker"+liker);

        Optional<MemberLikes> memberLikes2 = mlr.findByLikerAndLiked(liker, liked);

        if (memberLikes2.isPresent()) {
            mlr.delete(memberLikes2.get());
            System.out.println("좋아요 삭제 완료");
            msg="no";
        } else {
            System.out.println("해당 좋아요 기록이 없습니다. ");
            mlr.save(memberLikes);
            System.out.println("입력이 완료되었습니다.");
            msg="yes";

            // ✅ Notification 생성 & 저장
            Member likedMember = mr.findById(liked).orElseThrow();
            Member likerMember = mr.findById(liker).orElseThrow();

            Notification notification = new Notification();
            notification.setMember(likedMember); // 알림을 받을 사용자
            notification.setMessagefrom(likerMember.getNickname()); // 좋아요 누른 사용자 이름
            notification.setMessage(likerMember.getNickname() + "님이 회원님에게 라이크를 보냈습니다.");
            notification.setReadOnNot(0);

            Notification afternotification =  nr.save(notification); // 저장

            // ✅ SSE 알림 전송
            ses.sendNotification(liked, notification.getMessage(), afternotification);

        }
        return msg;
    }

    public List<Member> findLiker(int memberId) {
        // liked가 memberId인 MemberLikes 데이터를 모두 조회
        List<MemberLikes> likerList = mlr.findByLiked(memberId);
        System.out.println("likerList"+likerList);

        // MemberLikes에서 liker 정보를 기반으로 Member 객체를 가져오기
        List<Member> members = new ArrayList<>();
        for (MemberLikes like : likerList) {

            // 각 liker ID를 기반으로 Member 조회
            Optional<Member> memberOpt = mr.findByMemberId(like.getLiker());
            memberOpt.ifPresent(members::add);
//            memberOpt.ifPresent(members::add); // Member가 존재하면 리스트에 추가
        }
        System.out.println("members"+members);
        return members;
    }

//    public List<Member> getMatchedMember(int memberId) {
//        List<Member> members = new ArrayList<>();
//
//        //일단 내가 좋아하는 사람들이 담긴 객체(MemberLikes) 조회
//        List<MemberLikes> likedList = mlr.findByLiker(memberId);
//        System.out.println("likerList"+likedList);
//
//        //좋아하는 사람들이 담긴 객체(MemberLikes) 순회
//        for (MemberLikes like : likedList) {
//            System.out.println("캉캉이가 좋아하는 사람 : "+like.getLiked());
//
//            //내가 좋아하는 사람이 좋아하는 사람들이 담긴 객체(MemberLikes) 조회
//            List<MemberLikes> likedList2 = mlr.findByLiker(like.getLiked());
//
//            //내가 좋아하는 사람이 좋아하는 사람들이 담긴 객체(MemberLikes) 순회
//            for (MemberLikes like2 : likedList2){
//                System.out.println("캉캉이가 좋아하는 사람이 좋아하는 사람 : "+like2.getLiked());
//
//                //내가 좋아하는 사람이 좋아하는 사람이 나라면 데이터에 입력
//                if (like2.getLiked() == memberId){
//
//                    //like2.getLiker() 에는 나를 좋아하는 사람의 memberId가 담겨있음
//                    Optional<Member> memberOpt = mr.findByMemberId(like2.getLiker());
//                    memberOpt.ifPresent(members::add);
//                }
//
//            }
//
//        }
//
//        return members;
//    }


    public List<Member> getMatchedMember(int memberId) {
        List<Member> members = new ArrayList<>();

        // 내가 좋아하는 사람들이 담긴 객체(MemberLikes) 조회
        List<MemberLikes> likedList = mlr.findByLiker(memberId);
        System.out.println("likerList: " + likedList);

        // 좋아하는 사람들의 liked 리스트에서 내가 좋아하는 사람의 좋아요 리스트를 두 번 순회
        likedList.stream()
                .map(MemberLikes::getLiked)  // 내가 좋아하는 사람을 가져옴
                .flatMap(liked -> mlr.findByLiker(liked).stream())  // 내가 좋아하는 사람들의 좋아요 리스트 순회
                .filter(like2 -> like2.getLiked() == memberId)  // 내가 좋아하는 사람의 좋아요 목록 중, 내가 있는 경우
                .map(MemberLikes::getLiker)  // 나를 좋아하는 사람의 memberId를 가져옴
                .map(likerId -> mr.findByMemberId(likerId))  // likerId로 회원 조회
                .filter(Optional::isPresent)  // Optional이 비어 있지 않은 경우에만 추가
                .map(Optional::get)  // Optional에서 Member 객체 추출
                .forEach(members::add);  // 결과를 members 리스트에 추가

        return members;
    }

    public List<Member> getMembersWithNickname(String nickname, int memberId) {
        List<Member> members = mr.findAllByNickname(nickname);
        Optional<Member> meOpt = mr.findById(memberId); // 현재 로그인한 사용자 가져오기

        if (!meOpt.isPresent()) {
            return Collections.emptyList(); // 로그인 정보가 없으면 빈 리스트 반환
        }

        Member me = meOpt.get();
        List<Block> blockedByOthers = br.findAllByBlocked(me); // 나를 차단한 목록 가져오기
        List<Member> blockedByOthersList = blockedByOthers.stream()
                .map(Block::getBlocker)
                .collect(Collectors.toList());

        // 나를 차단한 사람을 제외하고 반환
        return members.stream()
                .filter(member -> !blockedByOthersList.contains(member))
                .collect(Collectors.toList());
    }

    public List<Member> getMembersByMBTI(int ei, int ns, int tf, int jp, int memberId) {
        Member mymember = mr.findById(memberId).orElseThrow(); // 현재 로그인한 사용자 가져오기
        int gender = mymember.getGender();
        gender = (gender == 0) ? 1 : 0; // 반대 성별로 설정

        // 반대 성별의 MBTI를 가진 멤버 목록 가져오기
        List<Member> members = mr.findByMemberInfo_EiAndMemberInfo_NsAndMemberInfo_TfAndMemberInfo_JpAndGender(ei, ns, tf, jp, gender);

        // 나를 차단한 사용자 목록 가져오기
        List<Block> blockedByOthers = br.findAllByBlocked(mymember);
        List<Member> blockedByOthersList = blockedByOthers.stream()
                .map(Block::getBlocker)
                .collect(Collectors.toList());

        // 차단된 사용자를 제외하고 반환
        return members.stream()
                .filter(member -> !blockedByOthersList.contains(member))
                .collect(Collectors.toList());
    }

    public void setTempUp(int chatGroupId, int memberId) {
        Member m = new Member();
        Member mm = new Member();
        ChatGroup cg = new ChatGroup();
        List<ChatGroupMember> cgm = new ArrayList<>();

        Optional<Member> member = mr.findById(memberId);
        if (member.isPresent()) {
           m = member.get();
        }

        Optional<ChatGroup> chatGroup = cgr.findByChatGroupId(chatGroupId);
        if (chatGroup.isPresent()) {
            cg = chatGroup.get();
        }

        cgm = cgmr.findByChatGroup(cg);
        for (ChatGroupMember cm : cgm) {
            if(cm.getMember()!=m){
                mm=cm.getMember();
            }
        }

        System.out.println("mm"+mm);

        mm.setTemp(mm.getTemp()+1);
        System.out.println("mm"+mm);
    }

    public void setTempDown(int chatGroupId, int memberId) {
        Member m = new Member();
        Member mm = new Member();
        ChatGroup cg = new ChatGroup();
        List<ChatGroupMember> cgm = new ArrayList<>();

        Optional<Member> member = mr.findById(memberId);
        if (member.isPresent()) {
            m = member.get();
        }

        Optional<ChatGroup> chatGroup = cgr.findByChatGroupId(chatGroupId);
        if (chatGroup.isPresent()) {
            cg = chatGroup.get();
        }

        cgm = cgmr.findByChatGroup(cg);
        for (ChatGroupMember cm : cgm) {
            if(cm.getMember()!=m){
                mm=cm.getMember();
            }
        }

        System.out.println("mm"+mm);

        mm.setTemp(mm.getTemp()-1);
        System.out.println("mm"+mm);

    }

    public void addBlockedFromRandomChat(int chatGroupId, int memberId) {
        Member m = new Member();
        Member mm = new Member();
        ChatGroup cg = new ChatGroup();
        List<ChatGroupMember> cgm = new ArrayList<>();

        Optional<Member> member = mr.findById(memberId);
        if (member.isPresent()) {
            m = member.get();
        }

        Optional<ChatGroup> chatGroup = cgr.findByChatGroupId(chatGroupId);
        if (chatGroup.isPresent()) {
            cg = chatGroup.get();
        }

        cgm = cgmr.findByChatGroup(cg);
        for (ChatGroupMember cm : cgm) {
            if(cm.getMember()!=m){
                mm=cm.getMember();
            }
        }

        Block block = new Block();
        block.setBlocker(m);
        block.setBlocked(mm);
        br.save(block);

    }

public Member getOppsiteGender2(int memberId) {
    Member oppositeGender = null;

    Optional<Member> memberOpt = mr.findByMemberId(memberId);
    if (!memberOpt.isPresent()) {
        return null; // 존재하지 않는 회원
    }

    Member m = memberOpt.get();
    System.out.println("Me member: " + m);

    List<Block> myBlocks = br.findAllByBlocker(m);
    List<Member> myBlockedMembers = myBlocks.stream()
            .map(Block::getBlocked)
            .collect(Collectors.toList());

    int gender = (m.getGender() == 0) ? 1 : 0;
    int ageRange = 3;
    int age = m.getAge();

    System.out.println("My Gender: " + gender);
    System.out.println("My Age: " + age);

    List<Member> filteredMembers = mr.findByGenderAndAgeRange(gender, age - ageRange, age + ageRange);
    Collections.shuffle(filteredMembers);

    for (Member candidate : filteredMembers) {
        System.out.println("Candidate: " + candidate);

        // 내가 차단한 사람인지 확인
        if (myBlockedMembers.contains(candidate)) {
            System.out.println("이 후보자는 내가 차단한 사람 -> 제외");
            continue;
        }

        // 상대방의 차단 목록 확인
        List<Block> theirBlocks = br.findAllByBlocker(candidate);
        List<Member> theirBlockedMembers = theirBlocks.stream()
                .map(Block::getBlocked)
                .collect(Collectors.toList());

        if (theirBlockedMembers.contains(m)) {
            System.out.println("이 후보자는 나를 차단함 -> 제외");
            continue;
        }

        System.out.println("Matching Success! Opposite Gender: " + candidate);
        oppositeGender = candidate;
        break;
    }

    return oppositeGender;
}

    public String addBlockedFromSearch(int blockedId, int blockerId) {

    Member blocker = new Member();
    Member blocked = new Member();

    Optional<Member> blockerMember = mr.findByMemberId(blockerId);
    if (blockerMember.isPresent()) {
        blocker = blockerMember.get();
    }
    Optional<Member> blockedMember = mr.findByMemberId(blockedId);
    if (blockedMember.isPresent()) {
        blocked = blockedMember.get();
    }

    Optional<Block> block = br.findByBlockedAndBlocker(blocked, blocker);
    if (block.isPresent()) {
        System.out.println("차단 해제합니다.");
        br.delete(block.get());
        return "no";
    }else{
        System.out.println("차단합니다.");
        Block block1 = new Block();
        block1.setBlocker(blocker);
        block1.setBlocked(blocked);
        br.save(block1);
        return "yes";
    }

    }
}
