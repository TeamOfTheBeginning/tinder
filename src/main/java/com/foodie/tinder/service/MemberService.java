package com.foodie.tinder.service;

import com.foodie.tinder.dao.MemberRepository;
import com.foodie.tinder.entity.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class MemberService {

    @Autowired
    MemberRepository mr;


    public Member getMember(String email) {

        Optional<Member> member = mr.findByEmail(email);
        if (member.isPresent()) {
            return member.get();
        } else {
            return null;
        }

    }

    public Member getMemberByNickname(String nickname) {

        Optional<Member> member = mr.findByNickname( nickname );
        if(member.isPresent()) return member.get();
        else  return null;

    }

    public void insertMember(Member member) {
        mr.save(member);
    }
}