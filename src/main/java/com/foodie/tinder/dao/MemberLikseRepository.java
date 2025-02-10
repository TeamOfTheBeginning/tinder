package com.foodie.tinder.dao;

import com.foodie.tinder.entity.MemberLikes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberLikseRepository extends JpaRepository<MemberLikes, Integer> {
    Optional<MemberLikes> findByLikerAndLiked(int liker, int liked);
}
