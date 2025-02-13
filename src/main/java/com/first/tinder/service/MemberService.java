package com.first.tinder.service;

import com.first.tinder.dao.FollowRepository;
import com.first.tinder.dao.MemberRepository;
import com.first.tinder.entity.Follow;
import com.first.tinder.entity.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    public Member getMemberById(int id) {

        Optional<Member> member = mr.findById(id);

        if(member.isPresent()) {
            return member.get();
        }else{
            return null;
        }
    }

    public void updateMember(Member member) {

        Optional<Member> memberOptional = mr.findById(member.getMemberId());
        if(memberOptional.isPresent()) {
            Member updateMember = memberOptional.get();
            updateMember.setEmail(member.getEmail());
            updateMember.setNickname(member.getNickname());
            updateMember.setPwd(member.getPwd());
            updateMember.setPhone(member.getPhone());
            updateMember.setAddress(member.getAddress());
            updateMember.setProfileImg(member.getProfileImg());
            updateMember.setProfileMsg(member.getProfileMsg());
            updateMember.setAge(member.getAge());
            updateMember.setGender(member.getGender());
            updateMember.setZipnum(member.getZipnum());

        }

    }


    @Autowired
    FollowRepository fr;

    public void addFollow(int follower, int followed) {

        Member followerMember = getMemberById(follower);
        Member followedMember = getMemberById(followed);

        Optional<Member> Follower = mr.findById(follower);
        if(Follower.isPresent()) {
            followerMember=Follower.get();
        }
        Optional<Member> Followed = mr.findById(followed);
        if(Followed.isPresent()) {
            followedMember=Followed.get();
        }

        Optional<Follow> Follow = fr.findByFollowerAndFollowed(followerMember,followedMember);
        if(Follow.isPresent()) {
            fr.delete(Follow.get());
        }else{
            Follow follow = new Follow();
            follow.setFollower(followerMember);
            follow.setFollowed(followedMember);
            fr.save(follow);
        }

    }

//    public void addFollow(Follow follow) {
//        Optional<Follow> followOptional = fr.findByFollowerAndFollowed(follow.getFollower(), follow.getFollowed());
//        if(followOptional.isPresent()) {
//            fr.delete(followOptional.get());
//            System.out.println("팔로우 취소");
//        }else{
//            fr.save(follow);
//            System.out.println("팔로우 합니다");
//        }
//    }

    public List<Follow> getFollower(Member member) {
       List<Follow> list = fr.findByFollower(member);
        return list;
    }

    public List<Follow> getFollowed(Member member) {
        List<Follow> list = fr.findByFollowed(member);
        return list;
    }

}