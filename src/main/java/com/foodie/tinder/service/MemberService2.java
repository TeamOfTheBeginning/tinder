package com.foodie.tinder.service;

import com.foodie.tinder.dao.MemberRepository;
import com.foodie.tinder.entity.Member;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@Transactional
public class MemberService2 {

    @Autowired
    MemberRepository mr;


    public Member getOppsiteGender(int gender) {
        List<Member> members = mr.findByGender(gender);

        if (members.isEmpty()) {
            return null;
        }

        Random random = new Random();
        return members.get(random.nextInt(members.size()));

    }
}
