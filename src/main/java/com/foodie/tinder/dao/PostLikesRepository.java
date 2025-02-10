package com.foodie.tinder.dao;


import com.foodie.tinder.entity.PostLikes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikesRepository extends JpaRepository<PostLikes, Integer> {

//    List<Likes> findByPostid(int postid);

//    Optional<Likes> findByPostidAndLikeid(int postid, int likeid);
}
