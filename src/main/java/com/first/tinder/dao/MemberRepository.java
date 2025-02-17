package com.first.tinder.dao;


import com.first.tinder.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {


    Optional<Member> findByEmail(String email);
    Optional<Member> findByNickname(String nickname);


    List<Member> findByGender(int gender);

    @Query("SELECT m FROM Member m WHERE m.gender = :gender AND m.age BETWEEN :minAge AND :maxAge")
    List<Member> findByGenderAndAgeRange(@Param("gender") int gender, @Param("minAge") int minAge, @Param("maxAge") int maxAge);

    Optional<Member> findByMemberId(int liker);

    List<Member> findAllByNickname(String name);
}
