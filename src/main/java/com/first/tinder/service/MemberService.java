package com.first.tinder.service;

import com.first.tinder.dao.FollowRepository;
import com.first.tinder.dao.MemberRepository;
import com.first.tinder.entity.Follow;
import com.first.tinder.entity.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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


    public List<Member> findNearbyMembers(double latitude, double longitude, int maxDistance, int memberId) {

        Member loginUser = mr.findById(memberId).orElse(null);
        if (loginUser == null) {
            // loginUser가 존재하지 않는 경우, 빈 목록을 반환하거나 예외를 던질 수 있습니다.
            return Collections.emptyList();
        }

        int loginUserGender = loginUser.getGender();

        List<Member> nearbyMembers = mr.findAll().stream()
                .filter(member -> member.getGender() != loginUserGender) // loginUser와 성별이 다른 Member만 필터링
                .filter(member -> calculateDistance(latitude, longitude, member.getLatitude(), member.getLongitude()) <= maxDistance)
                .collect(Collectors.toList());

        return nearbyMembers;
    }


    private static final int EARTH_RADIUS = 6371; // 지구의 반지름 (km)

    private double calculateDistance(double lat1, double lon1, Double lat2, Double lon2) {
        if (lat2 == null || lon2 == null) {
            // lat2 또는 lon2가 null인 경우 거리를 계산할 수 없으므로, 매우 큰 값을 반환하거나, 예외를 던집니다.
            return Double.MAX_VALUE; // 매우 큰 값을 반환하는 예시
        }

        // 위도와 경도를 라디안으로 변환
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        // Haversine 공식
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // 거리 계산 (km)
        double distance = EARTH_RADIUS * c;

        // km를 m로 변환하여 반환 (소수점 둘째 자리에서 반올림)
        return Math.round(distance * 1000.0) / 1000.0;
    }
}