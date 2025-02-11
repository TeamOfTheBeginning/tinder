package com.first.tinder.service;

import com.first.tinder.dao.MemberLikseRepository;
import com.first.tinder.dao.MemberRepository;
import com.first.tinder.dao.NotificationRepository;
import com.first.tinder.entity.Member;
import com.first.tinder.entity.MemberLikes;
import com.first.tinder.entity.Notification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    @Autowired
    NotificationRepository nr;

    @Autowired
    SseEmitterService ses;

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

            // ✅ Notification 생성 & 저장
            Member likedMember = mr.findById(liked).orElseThrow();
            Member likerMember = mr.findById(liker).orElseThrow();

            Notification notification = new Notification();
            notification.setMember(likedMember); // 알림을 받을 사용자
            notification.setMessagefrom(likerMember.getNickname()); // 좋아요 누른 사용자 이름
            notification.setMessage(likerMember.getNickname() + "님이 회원님에게 라이크를 보냈습니다.");
            notification.setReadOnNot(0);

            Notification afternotification =  nr.save(notification); // 저장

            // ✅ SSE 알림 전송
            ses.sendNotification(liked, notification.getMessage(), afternotification);

        }
        return msg;
    }

    public List<Member> findLiker(int memberId) {
        // liked가 memberId인 MemberLikes 데이터를 모두 조회
        List<MemberLikes> likerList = mlr.findByLiked(memberId);
        System.out.println("likerList"+likerList);

        // MemberLikes에서 liker 정보를 기반으로 Member 객체를 가져오기
        List<Member> members = new ArrayList<>();
        for (MemberLikes like : likerList) {

            // 각 liker ID를 기반으로 Member 조회
            Optional<Member> memberOpt = mr.findByMemberId(like.getLiker());
            memberOpt.ifPresent(members::add);
//            memberOpt.ifPresent(members::add); // Member가 존재하면 리스트에 추가
        }
        System.out.println("members"+members);
        return members;
    }
}
