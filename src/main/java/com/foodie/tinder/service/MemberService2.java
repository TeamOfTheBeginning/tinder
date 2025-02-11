package com.foodie.tinder.service;

import com.foodie.tinder.dao.MemberLikseRepository;
import com.foodie.tinder.dao.MemberRepository;
import com.foodie.tinder.entity.Member;
import com.foodie.tinder.entity.MemberLikes;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class MemberService2 {

    @Autowired
    MemberRepository mr;

    @Autowired
    MemberLikseRepository mlr;


    public Member getOppsiteGender(int gender, int age) {
//        List<Member> members = mr.findByGender(gender);


        int ageRange = 2;

        List<Member> filteredMembers = mr.findByGenderAndAgeRange(gender, age - ageRange, age + ageRange);


        if (filteredMembers.isEmpty()) {
            return null;
        }

        Random random = new Random();
        return filteredMembers.get(random.nextInt(filteredMembers.size()));

    }

    public void insert(MemberLikes memberLikes) {
        mlr.save(memberLikes);
    }

    public String checkLikes(MemberLikes memberLikes) {
        String msg ;
        int liked = memberLikes.getLiked();
        int liker = memberLikes.getLiker();

        System.out.println("liked"+liked);
        System.out.println("liker"+liker);

        Optional<MemberLikes> memberLikes2 = mlr.findByLikerAndLiked(liker, liked);

        if (memberLikes2.isPresent()) {
            mlr.delete(memberLikes2.get());
            System.out.println("좋아요 삭제 완료");
            msg="no";
        } else {
            System.out.println("해당 좋아요 기록이 없습니다. ");
            mlr.save(memberLikes);
            System.out.println("입력이 완료되었습니다.");
            msg="yes";
        }
        return msg;
    }
}
