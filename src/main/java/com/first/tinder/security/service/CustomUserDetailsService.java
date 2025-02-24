package com.first.tinder.security.service;

import com.first.tinder.dao.MemberRepository;
import com.first.tinder.dto.MemberDTO;
import com.first.tinder.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomUserDetailsService  implements UserDetailsService {

    private final MemberRepository mR;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 전송된  username 으로 사용자를 검색하고 DTO 객체에 넣어서  리턴하면서
        // UsernamePasswordAuthenticationFilter.class 로 이동합니다
        System.out.println("------------loadUserByUsername------------" + username );

        // 멤버를 조회
        Optional<Member> member = mR.findByEmail(username);
        if ( member.isEmpty() ) {
            throw new UsernameNotFoundException(username + " - User Not found");
        }
//        List<String> list = new ArrayList<>();
//        list.add("USER");

        // 멤버의 역할을 가져오기
        List<String> roleList = member.get().getMemberRoleList().stream()
                .map(Enum::name) // Enum의 이름을 가져옵니다.
                .collect(Collectors.toList());

        MemberDTO memberdto = new MemberDTO(
                member.get().getEmail() ,
                member.get().getPwd(),
                member.get().getMemberId(),
                member.get().getNickname(),
                member.get().getMemberName(),
                member.get().getPhone(),
                member.get().getGender(),
                member.get().getAge(),
                member.get().getBirthDate(),
                member.get().getAccount(),
                member.get().getZipnum(),
                member.get().getAddress(),
                member.get().getLatitude(),
                member.get().getLongitude(),
                member.get().getProfileImg(),
                member.get().getProfileMsg(),
                member.get().getSnsId(),
                member.get().getProvider(),
                member.get().getTemp(),
                roleList,
                member.get().getMemberInfo(),
                member.get().getOpponentMemberInfo()
        );
        System.out.println(memberdto);
        System.out.println(member);

        return memberdto;
    }
}
