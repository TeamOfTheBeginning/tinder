package com.foodie.tinder.dao;


import com.foodie.tinder.entity.Likes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikesRepository  extends JpaRepository<Likes, Integer> {

//    List<Likes> findByPostid(int postid);

//    Optional<Likes> findByPostidAndLikeid(int postid, int likeid);
}
