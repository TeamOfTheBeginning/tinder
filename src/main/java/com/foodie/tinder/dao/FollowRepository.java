package com.foodie.tinder.dao;


import com.foodie.tinder.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Integer> {

//    List<Follow> findByFto(int id);
//
//    List<Follow> findByFfrom(int id);
//
//    Optional<Follow> findByFfromAndFto(int ffrom, int fto);
}
