package com.first.tinder.controller;

import com.first.tinder.dao.MemberRepository;
import com.first.tinder.entity.Member;
import com.first.tinder.entity.MemberLikes;
import com.first.tinder.service.BlockService;
import com.first.tinder.service.MemberService2;
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



    @GetMapping("/getOppositeGender")
    public HashMap<String, Object> getOppositeGender(@RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();

        System.out.println("memberId = " + memberId);

        Member m = new Member();

        Optional<Member> loginMember = mr.findByMemberId(memberId);
        if (loginMember.isPresent()) {
            m = loginMember.get();
        }

        int gender = m.getGender();
        int age = m.getAge();

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

        System.out.println(oppositeGender);

        result.put("oppositeGender", oppositeGender);
        return result;
    }


    @GetMapping("/getOppositeGender2")
    public HashMap<String, Object> getOppositeGender2(@RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();

        System.out.println("memberId = " + memberId);

        Member oppositeGender;
        oppositeGender = ms2.getOppsiteGender2(memberId);

        System.out.println(oppositeGender);

        result.put("oppositeGender", oppositeGender);
        return result;
    }


    @PostMapping("/insertMemberLike")
    public HashMap<String, Object> insertMemberLike(@RequestBody MemberLikes memberLikes) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("memberLikes"+memberLikes);
        result.put("msg", ms2.checkLikes(memberLikes));
        return result;
    }

    @GetMapping("/findLiker")
    public HashMap<String, Object> findLiker(@RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("findLiker memberId : "+memberId);
        List<Member> likerList = ms2.findLiker(memberId);
        result.put("likerList", likerList);
        return result;
    }

    @GetMapping("/getMatchedMember")
    public HashMap<String, Object> getMatchedMember(@RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
//        System.out.println("getMatchedMember memberId : "+memberId);
        List<Member> matchedMemberList = ms2.getMatchedMember(memberId);
        System.out.println("matchedMemberList"+matchedMemberList);
        result.put("matchedMemberList", matchedMemberList);
        return result;
    }

    @GetMapping("/getMembersWithNickname")
    public HashMap<String, Object> getMembersWithNickname(@RequestParam("word") String word,@RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();

        List<Member> membersWithName = ms2.getMembersWithNickname(word, memberId);
        result.put("memberList", membersWithName);
        return result;
    }

    @GetMapping("/getMembersWithMBTI")
    public HashMap<String, Object> getMembersWithMBTI(@RequestParam("numberValue") String numberValue,@RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();

        System.out.println("numberValue"+numberValue);
        System.out.println("memberId"+memberId);

        int ei = Character.getNumericValue(numberValue.charAt(0)); // E/I
        int ns = Character.getNumericValue(numberValue.charAt(1)); // N/S
        int tf = Character.getNumericValue(numberValue.charAt(2)); // T/F
        int jp = Character.getNumericValue(numberValue.charAt(3)); // J/P

        System.out.println("ei = " + ei);
        System.out.println("ns = " + ns);
        System.out.println("tf = " + tf);
        System.out.println("jp = " + jp);

        List<Member> membersWithMBTI = ms2.getMembersByMBTI(ei, ns, tf, jp,memberId);

        result.put("memberList", membersWithMBTI);
        return result;
    }

    @PostMapping("/setTempUp")
    public HashMap<String, Object> setTempUp(@RequestParam("chatGroupId") int chatGroupId, @RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("chatGroupId : "+chatGroupId+" memberId : "+memberId);

        ms2.setTempUp(chatGroupId,memberId);

        result.put("msg", "yes");
        return result;
    }

    @PostMapping("/setTempDown")
    public HashMap<String, Object> setTempDown(@RequestParam("chatGroupId") int chatGroupId, @RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("chatGroupId : "+chatGroupId+" memberId : "+memberId);

        ms2.setTempDown(chatGroupId,memberId);

        result.put("msg", "yes");
        return result;
    }

    @PostMapping("/addBlockedFromRandomChat")
    public HashMap<String, Object> addBlockedFromRandomChat(@RequestParam("chatGroupId") int chatGroupId, @RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("chatGroupId : "+chatGroupId+" memberId : "+memberId);

        ms2.addBlockedFromRandomChat(chatGroupId,memberId);

        result.put("msg", "yes");
        return result;
    }

    @PostMapping("/addBlockedFromSearch")
    public HashMap<String,Object> addBlockedFromSearch(@RequestParam("blockedId") int blockedId,@RequestParam("blockerId") int blockerId){
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("blockedId : "+blockedId+" blockerId : "+blockerId);

        result.put("msg", ms2.addBlockedFromSearch(blockedId,blockerId));
        return result;
    }

    @PostMapping("/updateMBTI")
    public HashMap<String,Object> updateMBTI (@RequestParam("numberValue") String numberValue,@RequestParam("memberId") int memberId){
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("numberValue : "+numberValue+" memberId : "+memberId);

        int ei = Character.getNumericValue(numberValue.charAt(0)); // E/I
        int ns = Character.getNumericValue(numberValue.charAt(1)); // N/S
        int tf = Character.getNumericValue(numberValue.charAt(2)); // T/F
        int jp = Character.getNumericValue(numberValue.charAt(3)); // J/P

        System.out.println("ei = " + ei);
        System.out.println("ns = " + ns);
        System.out.println("tf = " + tf);
        System.out.println("jp = " + jp);

        ms2.setMemberMBTI(ei, ns, tf, jp,memberId);



//        result.put("msg", "yes");
        return result;
    }

}
