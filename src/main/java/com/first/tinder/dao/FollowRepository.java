package com.first.tinder.dao;


import com.first.tinder.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Integer> {


    Optional<Follow> findByFollowerAndFollowed(int follower, int followed);

    List<Follow> findByFollower(int id);

    List<Follow> findByFollowed(int id);
}
