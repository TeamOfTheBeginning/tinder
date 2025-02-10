package com.foodie.tinder.controller;

import com.foodie.tinder.entity.Member;
import com.foodie.tinder.service.MemberService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    MemberService ms;


    @PostMapping("/loginlocal")
    public HashMap<String, Object> loginlocal(
            @RequestParam("email") String email,
            @RequestParam("pwd") String pwd,
            HttpSession session) {
        System.out.println("loginlocal");
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMember(email);
        System.out.println(member);
        if( member == null){
            result.put("msg", "이메일을 확인하세요");
        }else if( !member.getPwd().equals( pwd ) ) {
            result.put("msg", "패스워드를 확인하세요");
        }else {
            result.put("msg", "ok");
            System.out.println("ok");
//            session.setAttribute("loginUser", member.getId() );
        }   System.out.println(result);
        return result;

    }



}
