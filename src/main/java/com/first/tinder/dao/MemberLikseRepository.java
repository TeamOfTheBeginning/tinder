package com.first.tinder.dao;

import com.first.tinder.entity.MemberLikes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberLikseRepository extends JpaRepository<MemberLikes, Integer> {
    Optional<MemberLikes> findByLikerAndLiked(int liker, int liked);

    List<MemberLikes> findByLiked(int memberId);
}
