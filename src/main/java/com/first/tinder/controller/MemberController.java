package com.first.tinder.controller;

import com.first.tinder.dao.MemberRepository;
import com.first.tinder.dto.KakaoProfile;
import com.first.tinder.dto.MemberDTO;
import com.first.tinder.dto.OAuthToken;
import com.first.tinder.entity.*;
import com.first.tinder.security.handler.APILoginSuccessHandler;
import com.first.tinder.security.service.CustomUserDetailsService;
import com.first.tinder.security.util.CustomJWTException;
import com.first.tinder.security.util.JWTUtil;
import com.first.tinder.service.*;
import com.google.gson.Gson;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.*;

@RestController
@RequestMapping("/member")
public class MemberController {

//    @Autowired
//    MemberService2 memberService2;

    @Autowired
    MemberService ms;

    @Autowired
    MemberInfoService mis;

    @Autowired
    OpponentMemberInfoService omis;

    @Autowired
    CustomUserDetailsService suds;

//1
//    @PostMapping("/loginlocal")
//    public HashMap<String, Object> loginlocal(
//            @RequestParam("email") String email,
//            @RequestParam("pwd") String pwd,
//            HttpSession session) {
//        HashMap<String, Object> result = new HashMap<>();
//        Member member = ms.getMember(email);
//        System.out.println(member);
//        if( member == null){
//            result.put("msg", "이메일을 확인하세요");
//        }else if( !member.getPwd().equals( pwd ) ) {
//            result.put("msg", "패스워드를 확인하세요");
//        }else if(member.getTemp() < 30){
//            result.put("msg", "온도가 낮아 서비스를 이용하실 수 없습니다.");
//        }else{
//            result.put("msg", "ok");
//            System.out.println("member id test :" + member.getMemberId());
//            session.setAttribute("loginUser", member.getMemberId() );
//        }
//        return result;
//    }

    //로그인된 사람의 정보를 수신합니다.
    @GetMapping("/getLoginUser")
    public HashMap<String , Object> getLoginUser(@RequestParam("memberId") int memberId) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("memberId"+memberId);
//        int id = (Integer) session.getAttribute("loginUser");

        Member member = ms.getMemberById(memberId);
        List<Follow> follower = ms.getFollower(member);
        List<Follow> followed = ms.getFollowed(member);

        result.put("loginUser", member);
        result.put("follower", follower);
        result.put("followed", followed);

        return result;
    }

    //이메일 중복 여부 검사합니다.
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

    //카카오 로그인을 위한 매서드들 입니다.
    @Value("${kakao.client_id}")
    private String client_id;

    @Value("${kakao.redirect_uri}")
    private String redirect_uri;

    @RequestMapping("/kakaoStart")
    public @ResponseBody String kakaoStart() {
//        System.out.println("kakaoStart");
        String a = "<script type='text/javascript'>"
                + "location.href='https://kauth.kakao.com/oauth/authorize?"
                + "client_id=" + client_id + "&"
                + "redirect_uri=" + redirect_uri + "&"
                + "response_type=code';" + "</script>";
        return a;
    }

    @RequestMapping("/kakaoLogin")
    public void kakaoLogin(HttpServletRequest request, HttpServletResponse response ) throws IOException {

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
//            System.out.println(input2);
        }
//        System.out.println("Gson");

//        System.out.println("Kakao Response: " + sb2.toString());
        Gson gson2 = new Gson();

//        System.out.println("gson2.fromJson(sb2.toString(), KakaoProfile.class)"+gson2.fromJson(sb2.toString(), KakaoProfile.class));


        KakaoProfile kakaoProfile = gson2.fromJson(sb2.toString(), KakaoProfile.class);
        KakaoProfile.KakaoAccount ac = kakaoProfile.getAccount();
        KakaoProfile.KakaoAccount.Profile pf = ac.getProfile();
//        System.out.println("id : " + kakaoProfile.getId());
//        System.out.println("KakaoAccount-Email : ");
//        System.out.println("KakaoAccount-Email : " + ac.getEmail());
//        System.out.println("Profile-Nickname : " + pf.getNickname());

        Member member = ms.getMemberBySnsId( kakaoProfile.getId() );
        if( member == null) {

            MemberInfo memberInfo = new MemberInfo();
            MemberInfo returnMemberInfo = mis.insertMemberInfo(memberInfo);

            OpponentMemberInfo opponentMemberInfo = new OpponentMemberInfo();
            OpponentMemberInfo returnOpponentMemberInfo = omis.insertOpponentMemberInfo(opponentMemberInfo);

            member = new Member();
            member.setEmail( kakaoProfile.getId() );
            // 기존회원의 닉네임과 신규 카카오 회원의 닉네임이 중보되는 경우의 처리가 필요합니다.
            member.setNickname( pf.getNickname() );
            member.setProvider( "kakao" );
            member.setPwd( "kakao" );

            Date today = new Date();
            member.setBirthDate(today);

            member.setSnsId( kakaoProfile.getId() );
            member.setTemp(37);
            member.setMemberRoleList(Collections.singletonList(MemberRole.USER));
            member.setMemberInfo( returnMemberInfo );
            member.setOpponentMemberInfo( returnOpponentMemberInfo );
            ms.insertMember(member);
        }
//        HttpSession session = request.getSession();
//        session.setAttribute("loginUser", member.getMemberId() );
//        response.sendRedirect("http://1.215.146.37:8380/savekakaoinfo/"+member.getEmail());

        String email = member.getEmail();
        String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8);
        response.sendRedirect("http://kdhhome.asuscomm.com:8400/kakaoLogin/" + encodedEmail);
//        response.sendRedirect("http://localhost:3000/kakaoLogin/" + encodedEmail);


//        String data1 = member.getEmail();
//        String data2 = "a";

//        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
//        System.out.println(pe.decode("a"));


//MemberDto
//        UserDetails userDetails =suds.loadUserByUsername(data1);
//
//        MemberDTO memberDTO = (MemberDTO) userDetails;
//
//        Map<String, Object> claims = memberDTO.getClaims();

//        // 사용장정보가 들어있는 Map 자료(claims)를 이용하여 토큰을 생성
//        String accessToken = JWTUtil.generateToken(claims, 1);
//        String refreshToken = JWTUtil.generateToken(claims, 60*24);
//
//        claims.put("accessToken", accessToken);
//        claims.put("refreshToken", refreshToken);
//        System.out.println("userDetails"+userDetails);
//        System.out.println("userDetails.getAuthorities()"+userDetails.getAuthorities());
//        System.out.println("userDetails.getAuthorities().getClass()"+userDetails.getAuthorities().getClass());

//        String data1 = "someData1";
//        String data2 = "someData2";

//        Gson gson = new Gson();
//        String jsonStr = gson.toJson(claims);  // claims에 있는 데이터를 json형태로 변환
//
//        response.setContentType("application/json");  // response 에 전송될 데이터형을 설정
//        response.setCharacterEncoding("UTF-8");   // 한글 인코딩 설정
//        PrintWriter printWriter = response.getWriter();  // 출력도구를 얻어서
//        printWriter.println(jsonStr);  // 얻어낸 도구로 출력  -> 전송
//        printWriter.close();
//
//
//        response.sendRedirect("http://localhost:3000/savekakaoinfo" );

        // 카카오 로그인 후, 클라이언트에 데이터를 쿠키로 설정
//        String jsonStr = gson.toJson(claims);
//        Cookie cookie = new Cookie("claims", URLEncoder.encode(jsonStr, "UTF-8"));
////        cookie.setHttpOnly(true);  // 보안을 위해 HttpOnly 속성 추가
//        cookie.setMaxAge(60 * 60); // 쿠키 유효 시간 1시간
//        cookie.setPath("/");  // 애플리케이션 전체에서 접근 가능하도록 설정
//        response.addCookie(cookie);  // 쿠키를 응답에 추가
//
//// 리다이렉션
//        response.sendRedirect("http://1.215.146.37:8380/savekakaoinfo");



//        response.sendRedirect("http://localhost:3000/savekakaoinfo?data=" + data);
    }

    //거리를 기준 맴버를 조회하는 매서드입니다.
    @GetMapping("/nearby")
    public List<Member> getNearbyMembers(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam int maxDistance,
            @RequestParam int memberId
    ) {
        return ms.findNearbyMembers(latitude, longitude, maxDistance, memberId);
    }



    //닉네임 중복 체크합니다.
    @PostMapping("/nicknamecheck")
    public HashMap<String, Object> nicknamecheck( @RequestParam("nickname") String nickname ) {
//        System.out.println("nicknamecheck");
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMemberByNickname(nickname);
        if( member != null )
            result.put("msg", "no");
        else
            result.put("msg", "ok");
        return result;
    }

    //파일 업로드
    @Autowired
    ServletContext context;

    @PostMapping("/fileupload")
    public HashMap<String, Object> fileupload( @RequestParam("image") MultipartFile file ) {
        HashMap<String, Object> result = new HashMap<>();
        String path = "/home/dhk/tinder/src/main/webapp/userimg";  // 절대 경로 설정
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

//    //아마존 업로드
//    @Autowired
//    S3UploadService sus;
//
//    @PostMapping("/fileupload")
//    public HashMap<String, Object> fileupload( @RequestParam("image") MultipartFile file){
//
//        HashMap<String, Object> result = new HashMap<String, Object>();
//        System.out.println("file"+file);
//        String originalfilename = file.getOriginalFilename();
//
//        try {
//            String uploadFilePathName =sus.saveFile(file);
//            System.out.println("originalfilename"+originalfilename);
//            System.out.println("uploadFilePathName"+uploadFilePathName);
//            result.put("originalfilename", originalfilename);
//            result.put("filename",uploadFilePathName);
//        } catch (IllegalStateException | IOException e) {
//            e.printStackTrace();
//        }
//        return result;
//    }


    //회원가입
    @PostMapping("/join")
    public HashMap<String, Object> join(@RequestBody Member member) {
//        System.out.println("join!!");
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

        MemberInfo memberInfo = new MemberInfo();
        MemberInfo returnMemberInfo = mis.insertMemberInfo(memberInfo);

        OpponentMemberInfo opponentMemberInfo = new OpponentMemberInfo();
        OpponentMemberInfo returnOpponentMemberInfo = omis.insertOpponentMemberInfo(opponentMemberInfo);


        member.setTemp(37);
        member.setMemberRoleList(Collections.singletonList(MemberRole.USER));
        member.setMemberInfo(returnMemberInfo);
        member.setOpponentMemberInfo(returnOpponentMemberInfo);

        ms.insertMember(member);
        result.put("msg", "ok");
        return result;
    }

//    //회원가입
//    @PostMapping("/join2")
//    public HashMap<String, Object> join2(@RequestBody Member member) {
////        System.out.println("join!!");
//        HashMap<String, Object> result = new HashMap<>();
//
//        // Date를 LocalDate로 변환
//        LocalDate birthLocalDate = member.getBirthDate().toInstant()
//                .atZone(ZoneId.systemDefault())
//                .toLocalDate();
//
//        // 현재 날짜
//        LocalDate now = LocalDate.now();
//
//        // 나이 계산
//        int age = Period.between(birthLocalDate, now).getYears();
//        member.setAge(age); // Member 객체에 나이 설정
//
//        MemberInfo memberInfo = new MemberInfo();
//        MemberInfo returnMemberInfo = mis.insertMemberInfo(memberInfo);
//
//        OpponentMemberInfo opponentMemberInfo = new OpponentMemberInfo();
//        OpponentMemberInfo returnOpponentMemberInfo = omis.insertOpponentMemberInfo(opponentMemberInfo);
//
//
//        member.setTemp(37);
//        member.setMemberRoleList(Collections.singletonList(MemberRole.USER));
//        member.setMemberInfo(returnMemberInfo);
//        member.setOpponentMemberInfo(returnOpponentMemberInfo);
//
//        ms.insertMember(member);
//        result.put("msg", "ok");
//        return result;
//    }

    //회원정보 수정시 닉네임 체크합니다.
    @PostMapping("/nicknamecheckUpdate")
    public HashMap<String, Object> nicknamecheckUpdate(
            @RequestParam("memberId") int memberId, @RequestParam("nickname") String nickname ) {
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMemberById(memberId);  // id로 멤버정보 조회
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

    //회원정보 수정합니다.
    @PostMapping("/update")
    public HashMap<String, Object> update( @RequestBody Member member) {
        HashMap<String, Object> result = new HashMap<>();
        ms.updateMember( member );
//        System.out.println("업데이트 완료");
        result.put("msg", "ok");
        return result;
    }

    //맴버를 팔로우합니다.
    @PostMapping("/follow")
    public HashMap<String, Object> follow( @RequestParam("follower") int follower, @RequestParam("followed") int followed ) {
//        System.out.println("##################################### : " + follower);
//        System.out.println("##################################### : " +followed);

        HashMap<String, Object> result = new HashMap<>();
        ms.addFollow( follower, followed );
        result.put("msg", "ok");
        return result;
    }

    //닉네임을 조회합니다.
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

    //회원의 특성을 수정합니다.
    @PostMapping("/updateCharacteristics")
    public HashMap<String, Object> updateCharacteristics(@RequestBody HashMap<String, Object> payload) {
        int memberId = (int) payload.get("memberId");

        List<Integer> characteristics = (List<Integer>) payload.get("characteristics");
//        System.out.println("memberId"+memberId+"characteristics"+characteristics);

        Member member = ms.getMemberById(memberId);
        MemberInfo memberInfo = member.getMemberInfo();
//        List<Hobby> hobbies = ms.getHobbiesByIds(characteristics);
//        System.out.println("characteristics[0]"+ characteristics.get(0));
//        System.out.println("characteristics[1]"+ characteristics.get(1));
//        System.out.println("characteristics[2]"+ characteristics.get(2));
//        System.out.println("characteristics[3]"+ characteristics.get(3));
//        System.out.println("characteristics[4]"+ characteristics.get(4));
        memberInfo.setSmoke(characteristics.get(0));
        memberInfo.setAlcohol(characteristics.get(1));
        memberInfo.setSpeed(characteristics.get(2));
        memberInfo.setDate(characteristics.get(3));
        memberInfo.setWorkout(characteristics.get(4));


//        System.out.println("memberInfo@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"+memberInfo);

        mis.updateMemberInfo(memberInfo);

        HashMap<String, Object> result = new HashMap<>();
        result.put("msg", "ok");
        return result;
    }

    // 선택된 취미 업데이트 API
    @PostMapping("/updateHobbies")
    public HashMap<String, Object> updateHobbies(@RequestBody HashMap<String, Object> payload) {
        int memberId = (int) payload.get("memberId");

        List<Integer> hobbyIds = (List<Integer>) payload.get("hobbies");
//        System.out.println("memberId"+memberId+"hobbyIds"+hobbyIds);

        Member member = ms.getMemberById(memberId);
        MemberInfo memberInfo = member.getMemberInfo();
        List<Hobby> hobbies = ms.getHobbiesByIds(hobbyIds);

        memberInfo.setHobbies(hobbies);
//        System.out.println("memberInfo@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"+memberInfo);
//        ms.updateMember(member);
        mis.updateMemberInfo(memberInfo);

        HashMap<String, Object> result = new HashMap<>();
        result.put("msg", "ok");
        return result;
    }

    @GetMapping("/refresh/{refreshToken}")
    public HashMap<String, Object> refresh(
            @PathVariable("refreshToken") String refreshToken,
            @RequestHeader("Authorization") String authHeader
    ) throws CustomJWTException {
        System.out.println("refresh token");
//        System.out.println("refresh token : " + refreshToken);

        HashMap<String, Object> result = new HashMap<>();

        // 리프레시 토큰이 없다면
        if( refreshToken == null ) throw new CustomJWTException("NULL_REFRESH");
        // Authorization 을 담은 헤더가 없다면
        if( authHeader == null || authHeader.length() < 7 )
            throw new CustomJWTException("INVALID_HEADER");

        //추출한 내용의 7번째 글자부터 끝까지 추출
        String accessToken = authHeader.substring(7);

        // 유효시간이 지났는지 검사
        Boolean expAt = checkExpiredToken( accessToken );

        if( expAt ){
//            System.out.println("토큰 유효기간 아직 안지났습니다. 계속 사용합니다");
            result.put("accessToken", accessToken);
            result.put("refreshToken", refreshToken);
        }else{
//            System.out.println("토큰이 갱신되었습니다");
//            System.out.println("accessToken : "+accessToken);
//            System.out.println("refreshToken : "+refreshToken);
            // accessToken 기간 만료시  refresh 토큰으로 재 검증하여 사용자 정보 추출
            Map<String, Object> claims = JWTUtil.validateToken(refreshToken);

            // 토큰 교체
            String newAccessToken = JWTUtil.generateToken(claims, 1);

            // 리프레시토큰의 exp 를 꺼내서 현재 시간과 비교
            Boolean expRt = checkTime( (Integer)claims.get("exp") );
            String newRefreshToken = "";
            // 기존 리프레시토큰의 유효기간이 한시간도 안남았다면 교체 , 아직 쓸만하다면 그데로 사용
            if( expRt )   newRefreshToken = JWTUtil.generateToken(claims, 60*24);
            else newRefreshToken = refreshToken;
//            System.out.println("newAccessToken : "+newAccessToken);
//            System.out.println("newRefreshToken : "+newRefreshToken);

            result.put("accessToken", newAccessToken);
            result.put("refreshToken", newRefreshToken);
        }
        return result;
    }

    private Boolean checkTime(Integer exp) {
        java.util.Date expDate = new java.util.Date( (long)exp * (1000 ));//밀리초로 변환
        long gap = expDate.getTime() - System.currentTimeMillis();//현재 시간과의 차이 계산
        long leftMin = gap / (1000 * 60); //분단위 변환
        //1시간도 안남았는지..
        return leftMin < 60;
    }

    private Boolean checkExpiredToken(String accessToken) {

        try {
            JWTUtil.validateToken(accessToken);
        } catch (CustomJWTException e) {
            // throw new RuntimeException(e);
            if( e.getMessage().equals("Expired") ){
                return false;
            }
        }
        return true;
    }




}
