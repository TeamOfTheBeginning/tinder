package com.first.tinder.controller;

import com.first.tinder.dao.MemberRepository;
import com.first.tinder.dto.KakaoProfile;
import com.first.tinder.dto.OAuthToken;
import com.first.tinder.entity.*;
import com.first.tinder.service.MemberInfoService;
import com.first.tinder.service.MemberService;
import com.google.gson.Gson;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    MemberService ms;

    @Autowired
    MemberInfoService mis;


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
        }else if(member.getTemp() < 30){
            result.put("msg", "온도가 낮아 서비스를 이용하실 수 없습니다.");
        }else{
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
        List<Follow> follower = ms.getFollower(member);
        List<Follow> followed = ms.getFollowed(member);

        result.put("loginUser", member);
        result.put("follower", follower);
        result.put("followed", followed);

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

    @Value("${kakao.client_id}")
    private String client_id;

    @Value("${kakao.redirect_uri}")
    private String redirect_uri;

    @RequestMapping("/kakaostart")
    public @ResponseBody String kakaostart() {
        String a = "<script type='text/javascript'>"
                + "location.href='https://kauth.kakao.com/oauth/authorize?"
                + "client_id=" + client_id + "&"
                + "redirect_uri=" + redirect_uri + "&"
                + "response_type=code';" + "</script>";
        return a;
    }

    @RequestMapping("/kakaoLogin")
    public void kakaoLogin(HttpServletRequest request, HttpServletResponse response ) throws IOException {
        try {
            String code = request.getParameter("code");
            String endpoint = "https://kauth.kakao.com/oauth/token";
            URL url = new URL(endpoint);
            String bodyData = "grant_type=authorization_code&";
            bodyData += "client_id=" + client_id + "&";
            bodyData += "redirect_uri=" + redirect_uri + "&";
            bodyData += "code=" + code;

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
            conn.setDoOutput(true);
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
            bw.write(bodyData);
            bw.flush();
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            String input = "";
            StringBuilder sb = new StringBuilder();
            while ((input = br.readLine()) != null) {
                sb.append(input);
            }
            Gson gson = new Gson();
            OAuthToken oAuthToken = gson.fromJson(sb.toString(), OAuthToken.class);
            String endpoint2 = "https://kapi.kakao.com/v2/user/me";
            URL url2 = new URL(endpoint2);

            HttpsURLConnection conn2 = (HttpsURLConnection) url2.openConnection();
            conn2.setRequestProperty("Authorization", "Bearer " + oAuthToken.getAccess_token());
            conn2.setDoOutput(true);
            BufferedReader br2 = new BufferedReader(new InputStreamReader(conn2.getInputStream(), "UTF-8"));
            String input2 = "";
            StringBuilder sb2 = new StringBuilder();
            while ((input2 = br2.readLine()) != null) {
                sb2.append(input2);
                System.out.println(input2);
            }
            System.out.println("Kakao API Response: " + sb2.toString()); // 응답 내용 로깅

            Gson gson2 = new Gson();
            KakaoProfile kakaoProfile = gson2.fromJson(sb2.toString(), KakaoProfile.class);

            if (kakaoProfile == null) {
                System.err.println("KakaoProfile is null!");
                // TODO: 적절한 에러 처리 로직 추가
                return; // 또는 예외를 던지거나, 에러 페이지로 리다이렉트
            }

            KakaoProfile.KakaoAccount ac = kakaoProfile.getAccount();
            if (ac == null) {
                System.err.println("KakaoAccount is null!");
                // TODO: 적절한 에러 처리 로직 추가
                return; // 또는 예외를 던지거나, 에러 페이지로 리다이렉트
            }

            com.first.tinder.dto.KakaoProfile.KakaoAccount.Profile pf = ac.getProfile();
            System.out.println("id : " + kakaoProfile.getId());
            System.out.println("KakaoAccount-Email : " + ac.getEmail());
            System.out.println("Profile-Nickname : " + pf.getNickname());

            Member member = ms.getMemberBySnsId( kakaoProfile.getId() );
            if( member == null) {
                member = new Member();
                member.setEmail( kakaoProfile.getId() );
                // 기존회원의 닉네임과 신규 카카오 회원의 닉네임이 중보되는 경우의 처리가 필요합니다.
                member.setNickname( pf.getNickname() );
                member.setProvider( "kakao" );
                member.setPwd( "kakao" );
                member.setSnsId( kakaoProfile.getId() );
                ms.insertMember(member);
            }
            HttpSession session = request.getSession();
            session.setAttribute("loginUser", member.getMemberId() );
            response.sendRedirect("http://localhost:3000/savekakaoinfo");

        } catch (IOException e) {
            e.printStackTrace();
            // TODO: 예외 처리 로직 (예: 에러 페이지 리다이렉트, 로그 기록 등)
            response.sendRedirect("/error"); // 예시
        }
    }




    @GetMapping("/nearby")
    public List<Member> getNearbyMembers(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam int maxDistance,
            @RequestParam int memberId
    ) {
        return ms.findNearbyMembers(latitude, longitude, maxDistance, memberId);
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
        String path = context.getRealPath("/userimg");
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

        // Date를 LocalDate로 변환
        LocalDate birthLocalDate = member.getBirthDate().toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();

        // 현재 날짜
        LocalDate now = LocalDate.now();

        // 나이 계산
        int age = Period.between(birthLocalDate, now).getYears();
        member.setAge(age); // Member 객체에 나이 설정

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
    public HashMap<String, Object> follow( @RequestParam("follower") int follower, @RequestParam("followed") int followed ) {
        System.out.println("##################################### : " + follower);
        System.out.println("##################################### : " +followed);

        HashMap<String, Object> result = new HashMap<>();
        ms.addFollow( follower, followed );
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

    // 취미 카테고리 및 취미 데이터 제공 API
    @GetMapping("/hobbies")
    public HashMap<String, Object> getHobbies() {
        HashMap<String, Object> result = new HashMap<>();
        result.put("categories", ms.getAllHobbyCategories());
        result.put("hobbies", ms.getAllHobbies());
        return result;
    }

    // 선택된 취미 업데이트 API
    @PostMapping("/updateHobbies")
    public HashMap<String, Object> updateHobbies(@RequestBody HashMap<String, Object> payload) {
        int memberId = (int) payload.get("memberId");

        List<Integer> hobbyIds = (List<Integer>) payload.get("hobbies");
        System.out.println("memberId"+memberId+"hobbyIds"+hobbyIds);

        Member member = ms.getMemberById(memberId);
        MemberInfo memberInfo = member.getMemberInfo();
        List<Hobby> hobbies = ms.getHobbiesByIds(hobbyIds);

        memberInfo.setHobbies(hobbies);
        System.out.println("memberInfo@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"+memberInfo);
//        ms.updateMember(member);
        mis.updateMemberInfo(memberInfo);

        HashMap<String, Object> result = new HashMap<>();
        result.put("msg", "ok");
        return result;
    }


}
