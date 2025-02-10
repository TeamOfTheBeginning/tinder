package com.foodie.tinder.controller;

import com.foodie.tinder.entity.Member;
import com.foodie.tinder.service.MemberService2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

        Member oppositeGender;

        if (gender=='0') {
            gender='1';
            oppositeGender = ms2.getOppsiteGender(gender);
        }else {
            gender='0';
            oppositeGender = ms2.getOppsiteGender(gender);
        }

        System.out.println(oppositeGender);

        result.put("oppositeGender", oppositeGender);
        return result;
    }

}
