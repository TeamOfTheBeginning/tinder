package com.first.tinder.controller;

import com.first.tinder.dao.MemberRepository;
import com.first.tinder.entity.*;
import com.first.tinder.service.BlockService;
import com.first.tinder.service.MemberService;
import com.first.tinder.service.MemberService2;
import com.first.tinder.service.OpponentMemberInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/member2")
public class MemberController2 {

    @Autowired
    private MemberService2 ms2;

    @Autowired
    MemberRepository mr;

    @Autowired
    BlockService bs;

    @Autowired
    MemberService ms;

    @Autowired
    OpponentMemberInfoService omis;



//    @GetMapping("/getOppositeGender")
//    public HashMap<String, Object> getOppositeGender(@RequestParam("memberId") int memberId) {
//        HashMap<String, Object> result = new HashMap<>();
////        System.out.println("memberId = " + memberId);
//        Member m = new Member();
//
//        Optional<Member> loginMember = mr.findByMemberId(memberId);
//        if (loginMember.isPresent()) {
//            m = loginMember.get();
//        }
//
//        int gender = m.getGender();
//        int age = m.getAge();
//
//        Member oppositeGender;
//
//        if (gender==0) {
////            System.out.println("gender2 : "+gender);
//            gender=1;
////            System.out.println("gender3 : "+gender);
//            oppositeGender = ms2.getOppsiteGender(gender,age);
//        }else {
////            System.out.println("gender22 : "+gender);
//            gender=0;
////            System.out.println("gender33 : "+gender);
//            oppositeGender = ms2.getOppsiteGender(gender,age);
//        }
////        System.out.println(oppositeGender);
//
//        result.put("oppositeGender", oppositeGender);
//        return result;
//    }

//이성을 조회합니다.
    @GetMapping("/getOppositeGender2")
    public HashMap<String, Object> getOppositeGender2(@RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
//        System.out.println("memberId = " + memberId);
        Member oppositeGender;
        oppositeGender = ms2.getOppsiteGender2(memberId);
//        System.out.println(oppositeGender);
        result.put("oppositeGender", oppositeGender);
        return result;
    }


    //라이크를 보냅니다.
    @PostMapping("/insertMemberLike")
    public HashMap<String, Object> insertMemberLike(@RequestBody MemberLikes memberLikes) {
        HashMap<String, Object> result = new HashMap<>();
//        System.out.println("memberLikes"+memberLikes);
        result.put("msg", ms2.checkLikes(memberLikes));
        return result;
    }

    //라이크 보낸 사람을 조회합니다.
    @GetMapping("/findLiker")
    public HashMap<String, Object> findLiker(@RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
//        System.out.println("findLiker memberId : "+memberId);
        List<Member> likerList = ms2.findLiker(memberId);
        result.put("likerList", likerList);
        return result;
    }

    //매칭된 사람을 조회합니다.
    @GetMapping("/getMatchedMember")
    public HashMap<String, Object> getMatchedMember(@RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
//        System.out.println("getMatchedMember memberId : "+memberId);
        List<Member> matchedMemberList = ms2.getMatchedMember(memberId);
        System.out.println("matchedMemberList"+matchedMemberList);
        result.put("matchedMemberList", matchedMemberList);
        return result;
    }

    //닉네임으로 맴버를 조회합니다.
    @GetMapping("/getMembersWithNickname")
    public HashMap<String, Object> getMembersWithNickname(@RequestParam("word") String word,@RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
        List<Member> membersWithName = ms2.getMembersWithNickname(word, memberId);
        result.put("memberList", membersWithName);
        return result;
    }

    //MBTI로 맴버를 조회합니다.
    @GetMapping("/getMembersWithMBTI")
    public HashMap<String, Object> getMembersWithMBTI(@RequestParam("numberValue") String numberValue,@RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();

//        System.out.println("numberValue"+numberValue);
//        System.out.println("memberId"+memberId);
        int ei = Character.getNumericValue(numberValue.charAt(0)); // E/I
        int ns = Character.getNumericValue(numberValue.charAt(1)); // N/S
        int tf = Character.getNumericValue(numberValue.charAt(2)); // T/F
        int jp = Character.getNumericValue(numberValue.charAt(3)); // J/P
//        System.out.println("ei = " + ei);
//        System.out.println("ns = " + ns);
//        System.out.println("tf = " + tf);
//        System.out.println("jp = " + jp);
        List<Member> membersWithMBTI = ms2.getMembersByMBTI(ei, ns, tf, jp,memberId);

        result.put("memberList", membersWithMBTI);
        return result;
    }

    //상대 온도를 올립니다.
    @PostMapping("/setTempUp")
    public HashMap<String, Object> setTempUp(@RequestParam("chatGroupId") int chatGroupId, @RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
//        System.out.println("chatGroupId : "+chatGroupId+" memberId : "+memberId);ㄴ
        ms2.setTempUp(chatGroupId,memberId);
        result.put("msg", "yes");
        return result;
    }

    //상대 온도를 내립니다.
    @PostMapping("/setTempDown")
    public HashMap<String, Object> setTempDown(@RequestParam("chatGroupId") int chatGroupId, @RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
//        System.out.println("chatGroupId : "+chatGroupId+" memberId : "+memberId);
        ms2.setTempDown(chatGroupId,memberId);
        result.put("msg", "yes");
        return result;
    }

    //랜덤쪽지방에서 차단합니다.
    @PostMapping("/addBlockedFromRandomChat")
    public HashMap<String, Object> addBlockedFromRandomChat(@RequestParam("chatGroupId") int chatGroupId, @RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
//        System.out.println("chatGroupId : "+chatGroupId+" memberId : "+memberId);
        ms2.addBlockedFromRandomChat(chatGroupId,memberId);
        result.put("msg", "yes");
        return result;
    }

    //차단합니다.
    @PostMapping("/addBlockedFromSearch")
    public HashMap<String,Object> addBlockedFromSearch(@RequestParam("blockedId") int blockedId,@RequestParam("blockerId") int blockerId){
        HashMap<String, Object> result = new HashMap<>();
//        System.out.println("blockedId : "+blockedId+" blockerId : "+blockerId);

        result.put("msg", ms2.addBlockedFromSearch(blockedId,blockerId));
        return result;
    }

    //내 MBTI를 업데이트 합니다.
    @PostMapping("/updateMBTI")
    public HashMap<String,Object> updateMBTI (@RequestParam("numberValue") String numberValue,@RequestParam("memberId") int memberId){
        HashMap<String, Object> result = new HashMap<>();
//        System.out.println("numberValue : "+numberValue+" memberId : "+memberId);

        int ei = Character.getNumericValue(numberValue.charAt(0)); // E/I
        int ns = Character.getNumericValue(numberValue.charAt(1)); // N/S
        int tf = Character.getNumericValue(numberValue.charAt(2)); // T/F
        int jp = Character.getNumericValue(numberValue.charAt(3)); // J/P

//        System.out.println("ei = " + ei);
//        System.out.println("ns = " + ns);
//        System.out.println("tf = " + tf);
//        System.out.println("jp = " + jp);
        ms2.setMemberMBTI(ei, ns, tf, jp,memberId);
//        result.put("msg", "yes");
        return result;
    }


//상대방의 MBTI를 설정합니다.
    @PostMapping("/updateOpponentMBTI")
    public HashMap<String,Object> updateOpponentMBTI (@RequestParam("numberValue") String numberValue,@RequestParam("memberId") int memberId){
        HashMap<String, Object> result = new HashMap<>();
//        System.out.println("numberValue : "+numberValue+" memberId : "+memberId);

        int ei = Character.getNumericValue(numberValue.charAt(0)); // E/I
        int ns = Character.getNumericValue(numberValue.charAt(1)); // N/S
        int tf = Character.getNumericValue(numberValue.charAt(2)); // T/F
        int jp = Character.getNumericValue(numberValue.charAt(3)); // J/P

//        System.out.println("ei = " + ei);
//        System.out.println("ns = " + ns);
//        System.out.println("tf = " + tf);
//        System.out.println("jp = " + jp);
        ms2.setOpponentMemberMBTI(ei, ns, tf, jp,memberId);
//        result.put("msg", "yes");
        return result;
    }

    // 선택된 취미 업데이트 API
//    @PostMapping("/updateOpponentHobbies")
//    public HashMap<String, Object> updateOpponentHobbies(@RequestBody HashMap<String, Object> payload) {
//        int memberId = (int) payload.get("memberId");
//
//        List<Integer> hobbyIds = (List<Integer>) payload.get("hobbies");
//        System.out.println("memberId"+memberId+"hobbyIds"+hobbyIds);
//
//        Member member = ms.getMemberById(memberId);
//        OpponentMemberInfo opponentMemberInfo = member.getOpponentMemberInfo();
//        List<Hobby> hobbies = ms.getHobbiesByIds(hobbyIds);
//
//        opponentMemberInfo.setHobbies(hobbies);
//        System.out.println("memberInfo@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"+opponentMemberInfo);
////        ms.updateMember(member);
//        omis.updateOpponentMemberInfo(opponentMemberInfo);
//
//        HashMap<String, Object> result = new HashMap<>();
//        result.put("msg", "ok");
//        return result;
//    }

    @PostMapping("/setMemberRoleGold")
    public HashMap<String,Object> setMemberRoleGold (@RequestParam("memberId") int memberId){
        HashMap<String, Object> result = new HashMap<>();
        String msg = ms2.setMemberRoleGold(memberId);
        result.put("msg", msg);
        return result;
    }

    @PostMapping("setTutorialHidden")
    public HashMap<String,Object> setTutorialHidden (@RequestParam("memberId") int memberId){
        HashMap<String, Object> result = new HashMap<>();
        String msg = ms2.setTutorialHidden(memberId);
        result.put("msg", msg);
        return result;
    }

}
