package com.first.tinder.security.filter;

import com.first.tinder.dto.MemberDTO;
import com.first.tinder.entity.MemberInfo;
import com.first.tinder.entity.OpponentMemberInfo;
import com.first.tinder.security.util.JWTUtil;
import com.first.tinder.security.util.CustomJWTException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;


public class JWTCheckFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        System.out.println("check uri..............2" + path);

        String authHeaderStr = request.getHeader("Authorization");
        String accessToken = authHeaderStr.substring(7);
        try {
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);
            int memberId = (int) claims.get("memberId");
            String email = (String) claims.get("email");
            String pwd = (String) claims.get("pwd");
            String nickname = (String) claims.get("nickname");
            String memberName = (String) claims.get("memberName");
            String phone = (String) claims.get("phone");
            int gender = (int) claims.get("gender");
            int age = (int) claims.get("age");
            Date birthDate = (Date) claims.get("birthDate");
            int account = (int) claims.get("account");
            String zipnum = (String) claims.get("zipnum");
            String address = (String) claims.get("address");
            Double latitude = (Double) claims.get("latitude");
            Double longitude = (Double) claims.get("longitude");
            String profileImg = (String) claims.get("profileImg");
            String profileMsg = (String) claims.get("profileMsg");

            String snsId = (String) claims.get("snsId");
            String provider = (String) claims.get("provider");

            int temp = (int) claims.get("temp");

            List<String> list = new ArrayList<>();
            list.add("USER");

            MemberInfo memberInfo = (MemberInfo) claims.get("memberInfo");
            OpponentMemberInfo opponentMemberInfo = (OpponentMemberInfo) claims.get("opponentMemberInfo");

            MemberDTO memberDTO = new MemberDTO(email, pwd, memberId, nickname, memberName, phone, gender,age, birthDate ,account,zipnum,address,latitude,longitude, profileImg, profileMsg, snsId ,provider,temp, list
                    ,memberInfo,opponentMemberInfo);

            UsernamePasswordAuthenticationToken authenticationToken
                    = new UsernamePasswordAuthenticationToken(memberDTO, pwd , memberDTO.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);
        } catch (CustomJWTException e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request)  throws ServletException {
        String path = request.getRequestURI();
        System.out.println("check uri.............." + path);
        if(request.getMethod().equals("OPTIONS"))
            return true;
        if(path.startsWith("/member/loginlocal"))
            return true;
        if(path.startsWith("/images/"))
            return true;
        if(path.startsWith("/userimg/"))
            return true;
        if(path.startsWith("/img/"))
            return true;

        if(path.startsWith("/member/emailcheck"))
            return true;
        if(path.startsWith("/member/nicknamecheck"))
            return true;
        if(path.startsWith("/member/fileupload"))
            return true;
        if(path.startsWith("/member/join"))
            return true;

        if(path.startsWith("/member/kakaoStart"))
            return true;
        if(path.startsWith("/member/kakaoLogin"))
            return true;

        if(path.startsWith("/member/getEmail"))
            return true;

        if(path.startsWith("/member/refresh"))
            return true;

        if(path.startsWith("/ws_real_chat"))
            return true;

        if(path.startsWith("/sse"))
            return true;


        return false;
    }
}
