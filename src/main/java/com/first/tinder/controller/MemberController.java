package com.first.tinder.controller;

import com.first.tinder.entity.Follow;
import com.first.tinder.entity.Member;
import com.first.tinder.service.MemberService;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

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
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMember(email);
        System.out.println(member);
        if( member == null){
            result.put("msg", "이메일을 확인하세요");
        }else if( !member.getPwd().equals( pwd ) ) {
            result.put("msg", "패스워드를 확인하세요");
        }else {
            result.put("msg", "ok");
            System.out.println("member id test :" + member.getMemberId());
            session.setAttribute("loginUser", member.getMemberId() );
        }
        return result;

    }

    @GetMapping("/getLoginUser")
    public HashMap<String , Object> getLoginUser(HttpSession session) {
        HashMap<String, Object> result = new HashMap<>();
        int id = (Integer) session.getAttribute("loginUser");

        Member member = ms.getMemberById(id);
//        List<Follow> followers = ms.getFollowers(id);
//        List<Follow> followings = ms.getFollowings(id);

        result.put("loginUser", member);
//        result.put("followers", followers);
//        result.put("followings", followings);

        return result;
    }

    @PostMapping("/emailcheck")
    public HashMap<String, Object> emailcheck( @RequestParam("email") String email ) {
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMember(email);
        if( member != null )
            result.put("msg", "no");
        else
            result.put("msg", "ok");
        return result;
    }

    @PostMapping("/nicknamecheck")
    public HashMap<String, Object> nicknamecheck( @RequestParam("nickname") String nickname ) {
        System.out.println("nicknamecheck");
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMemberByNickname(nickname);
        if( member != null )
            result.put("msg", "no");
        else
            result.put("msg", "ok");
        return result;
    }

    @GetMapping("/logout")
    public HashMap<String, Object> logout(HttpSession session) {
        HashMap<String, Object> result = new HashMap<>();
        session.removeAttribute("loginUser");
        result.put("msg", "ok");
        return result;
    }

    @Autowired
    ServletContext context;

    @PostMapping("/fileupload")
    public HashMap<String, Object> fileupload( @RequestParam("image") MultipartFile file ) {
        HashMap<String, Object> result = new HashMap<>();
        String path = context.getRealPath("/userImg");
        Calendar today = Calendar.getInstance();
        long dt = today.getTimeInMillis();
        String filename = file.getOriginalFilename();
        String fn1 = filename.substring(0, filename.indexOf(".") );
        String fn2 = filename.substring(filename.indexOf(".") );
        String uploadPath = path + "/" + fn1 + dt + fn2;
        try {
            file.transferTo( new File(uploadPath) );
            result.put("filename", fn1 + dt + fn2);
        } catch (IllegalStateException | IOException e) {
            e.printStackTrace();
        }
        System.out.print(result);
        return result;
    }


    @PostMapping("/join")
    public HashMap<String, Object> join(@RequestBody Member member) {
        System.out.println("join0!!");
        HashMap<String, Object> result = new HashMap<>();
        ms.insertMember(member);
        result.put("msg", "ok");
        return result;


    }



    @PostMapping("/emailcheckUpdate")
    public HashMap<String, Object> emailcheckUpdate( @RequestParam("email") String email, HttpSession session ) {
        HashMap<String, Object> result = new HashMap<>();
        int loginUserUserid = (Integer)session.getAttribute("loginUser");
        Member member = ms.getMemberById(loginUserUserid);
        String loginUserEmail = member.getEmail();
        Member updateMember = ms.getMember(email);
        if( loginUserEmail.equals(email) || updateMember == null ) {
            result.put("msg", "ok");
        }else{
            result.put("msg", "no");
        }
        return result;
    }


    @PostMapping("/nicknamecheckUpdate")
    public HashMap<String, Object> nicknamecheckUpdate(
            @RequestParam("nickname") String nickname,
            HttpSession session ) {
        HashMap<String, Object> result = new HashMap<>();
        int loginUserUserid = (Integer)session.getAttribute("loginUser");  // 로그인 유저의  id 추출
        Member member = ms.getMemberById(loginUserUserid);  // id로 멤버정보 조회
        String loginUserNickname = member.getNickname();  // 조회된 정보에서 닉네임 추출
        Member updateMember = ms.getMemberByNickname(nickname);   // 수정하려면 닉네임으로 멤버조회
        // 로그인유저의 닉네임과 수정하려는 닉네임 같거나
        // 다르다면 수정하려는 닉엠이 사용중이 아닐때  ok
        if( loginUserNickname.equals(nickname) || updateMember == null ) {
            result.put("msg", "ok");
        }else{
            result.put("msg", "no");
        }
        return result;
    }

    @PostMapping("/update")
    public HashMap<String, Object> update( @RequestBody Member member) {
        HashMap<String, Object> result = new HashMap<>();
        ms.updateMember( member );
        System.out.println("업데이트1 완료");
        result.put("msg", "ok");
        return result;
    }


    @PostMapping("/follow")
    public HashMap<String, Object> follow( @RequestBody Follow follow) {
        HashMap<String, Object> result = new HashMap<>();
        ms.addFollow( follow );
        result.put("msg", "ok");
        return result;
    }

    @GetMapping("/getNickname/{memberId}")
    public HashMap<String, Object> getNickname( @PathVariable("memberId") int memberId ){
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMemberById(memberId);
        result.put("nickname", member.getNickname());
        return result;
    }












}
