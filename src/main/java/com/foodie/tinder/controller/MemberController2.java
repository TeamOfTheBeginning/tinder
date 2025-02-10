package com.foodie.tinder.controller;

import com.foodie.tinder.entity.Member;
import com.foodie.tinder.entity.MemberLikes;
import com.foodie.tinder.service.MemberService2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/member2")
public class MemberController2 {

    @Autowired
    private MemberService2 ms2;


    @GetMapping("/getOppositeGender")
    public HashMap<String, Object> getOppositeGender(@RequestParam int gender) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("gender1"+gender);
        Member oppositeGender;

        if (gender==0) {
            System.out.println("gender2"+gender);
            gender=1;
            System.out.println("gender3"+gender);
            oppositeGender = ms2.getOppsiteGender(gender);
        }else {
            System.out.println("gender22:"+gender);
            gender=0;
            System.out.println("gender33:"+gender);
            oppositeGender = ms2.getOppsiteGender(gender);
        }

        System.out.println(oppositeGender);

        result.put("oppositeGender", oppositeGender);
        return result;
    }


    @PostMapping("/insertLike")
    public HashMap<String, Object> insertLike(@RequestBody MemberLikes memberLikes) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("memberLikes"+memberLikes);
//        ms2.checkLikes(memberLikes);

//        ms2.insert(memberLikes);

        result.put("msg", ms2.checkLikes(memberLikes));
        return result;

    }

}
