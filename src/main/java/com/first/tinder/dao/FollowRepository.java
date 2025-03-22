package com.first.tinder.dao;


import com.first.tinder.entity.Follow;
import com.first.tinder.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Integer> {
    Optional<Follow> findByFollowerAndFollowed(Member followerMember, Member followedMember);

    List<Follow> findByFollower(Member followerMember);

    List<Follow> findByFollowed(Member followedMember);
}
